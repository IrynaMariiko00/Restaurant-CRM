import { menuCategoriesApi } from "@/api/menuCategories";
import { useFeedback } from "@/context/FeedbackContext";
import { stableFormEqual } from "@/hooks/useFormSubmitGate";
import type {
  MenuCategory,
  MenuCategoryRequest,
} from "@/types/menuCategory";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type CategoryKind = "parent" | "child";
export type CategoryEditorMode = "create" | "edit";

export type CategoryFormValues = {
  nameDefaultLanguage: string;
  nameSecondLanguage: string;
};

export type CategoryDraft = {
  kind: CategoryKind;
  mode: CategoryEditorMode;
  id: number | null;
  form: CategoryFormValues;
  baseline: CategoryFormValues;
};

export type CategoryEditorState = {
  mode: CategoryEditorMode;
  kind: CategoryKind;
  id: number | null;
};

const emptyForm: CategoryFormValues = {
  nameDefaultLanguage: "",
  nameSecondLanguage: "",
};

export function categoryDraftKey(
  kind: CategoryKind,
  mode: CategoryEditorMode,
  id: number | null = null,
) {
  return mode === "create" ? `${kind}:create` : `${kind}:${id}`;
}

function toRequest(form: CategoryFormValues): MenuCategoryRequest {
  const nameDefaultLanguage = form.nameDefaultLanguage.trim();
  const nameSecondLanguage = form.nameSecondLanguage.trim();
  return {
    ...(nameDefaultLanguage ? { nameDefaultLanguage } : {}),
    ...(nameSecondLanguage ? { nameSecondLanguage } : {}),
  };
}

function isFormComplete(form: CategoryFormValues) {
  return (
    form.nameDefaultLanguage.trim().length > 0 ||
    form.nameSecondLanguage.trim().length > 0
  );
}

function formFromCategory(item: MenuCategory): CategoryFormValues {
  return {
    nameDefaultLanguage: item.nameDefaultLanguage ?? "",
    nameSecondLanguage: item.nameSecondLanguage ?? "",
  };
}

function isDraftDirty(draft: CategoryDraft) {
  return !stableFormEqual(draft.form, draft.baseline);
}

async function persistDraft(
  draft: CategoryDraft,
  selectedParentId: number | null,
) {
  const payload = toRequest(draft.form);

  if (draft.mode === "create" && draft.kind === "parent") {
    return menuCategoriesApi.createParent(payload);
  }
  if (draft.mode === "create" && draft.kind === "child") {
    if (selectedParentId == null) return null;
    return menuCategoriesApi.createChild(selectedParentId, payload);
  }
  if (draft.mode === "edit" && draft.kind === "parent" && draft.id != null) {
    return menuCategoriesApi.updateParent(draft.id, payload);
  }
  if (draft.mode === "edit" && draft.kind === "child" && draft.id != null) {
    return menuCategoriesApi.updateChild(draft.id, payload);
  }
  return null;
}

export function useMenuCategoriesAdmin() {
  const { t } = useTranslation();
  const feedback = useFeedback();

  const [parents, setParents] = useState<MenuCategory[]>([]);
  const [children, setChildren] = useState<MenuCategory[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const [isLoadingParents, setIsLoadingParents] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, CategoryDraft>>({});
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    kind: CategoryKind;
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const dirtyDrafts = Object.values(drafts).filter(isDraftDirty);
  const hasDrafts = Object.keys(drafts).length > 0;
  const canSubmit =
    !isSaving &&
    dirtyDrafts.length > 0 &&
    dirtyDrafts.every((draft) => isFormComplete(draft.form));

  const openDraft = openKey ? drafts[openKey] ?? null : null;
  const editor: CategoryEditorState | null = openDraft
    ? { mode: openDraft.mode, kind: openDraft.kind, id: openDraft.id }
    : null;
  const form = openDraft?.form ?? emptyForm;

  const loadParents = useCallback(async () => {
    setIsLoadingParents(true);
    setLoadError(null);
    try {
      const response = await menuCategoriesApi.getParents({
        page: 0,
        size: 100,
        sort: "nameDefaultLanguage,asc",
      });
      if (!response.success || !response.data) {
        setParents([]);
        setSelectedParentId(null);
        setLoadError(
          response.errors?.[0] ?? t("admin.categories_load_error"),
        );
        return;
      }
      const items = response.data.items;
      setParents(items);
      setSelectedParentId((prev) => {
        if (prev != null && items.some((item) => item.id === prev)) {
          return prev;
        }
        return items[0]?.id ?? null;
      });
    } catch {
      setParents([]);
      setSelectedParentId(null);
      setLoadError(t("admin.categories_load_error"));
    } finally {
      setIsLoadingParents(false);
    }
  }, [t]);

  const loadChildren = useCallback(async (parentId: number) => {
    setIsLoadingChildren(true);
    try {
      const response = await menuCategoriesApi.getChildren(parentId, {
        page: 0,
        size: 100,
        sort: "nameDefaultLanguage,asc",
      });
      if (!response.success || !response.data) {
        setChildren([]);
        return;
      }
      setChildren(response.data.items);
    } catch {
      setChildren([]);
    } finally {
      setIsLoadingChildren(false);
    }
  }, []);

  useEffect(() => {
    void loadParents();
  }, [loadParents]);

  useEffect(() => {
    if (selectedParentId == null) {
      setChildren([]);
      return;
    }
    void loadChildren(selectedParentId);
  }, [selectedParentId, loadChildren]);

  const clearDrafts = () => {
    setDrafts({});
    setOpenKey(null);
    setFormError(null);
  };

  const closeEditor = () => {
    if (isSaving) return;
    clearDrafts();
  };

  const selectParent = (id: number | null) => {
    if (isSaving) return;
    setSelectedParentId(id);
    clearDrafts();
  };

  const upsertDraft = (draft: CategoryDraft) => {
    const key = categoryDraftKey(draft.kind, draft.mode, draft.id);
    setDrafts((prev) => ({ ...prev, [key]: draft }));
    setOpenKey(key);
    setFormError(null);
  };

  const openCreateParent = () => {
    upsertDraft({
      kind: "parent",
      mode: "create",
      id: null,
      form: emptyForm,
      baseline: emptyForm,
    });
  };

  const openCreateChild = () => {
    if (selectedParentId == null) return;
    upsertDraft({
      kind: "child",
      mode: "create",
      id: null,
      form: emptyForm,
      baseline: emptyForm,
    });
  };

  const openEdit = (kind: CategoryKind, id: number) => {
    const key = categoryDraftKey(kind, "edit", id);

    if (openKey === key) {
      setOpenKey(null);
      return;
    }

    const existing = drafts[key];
    if (existing) {
      setOpenKey(key);
      setFormError(null);
      return;
    }

    const item =
      kind === "parent"
        ? parents.find((row) => row.id === id)
        : children.find((row) => row.id === id);

    if (!item) {
      setFormError(t("admin.categories_load_one_error"));
      return;
    }

    const next = formFromCategory(item);
    upsertDraft({
      kind,
      mode: "edit",
      id,
      form: next,
      baseline: next,
    });
  };

  const setField = <K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K],
  ) => {
    if (!openKey) return;
    setDrafts((prev) => {
      const current = prev[openKey];
      if (!current) return prev;
      return {
        ...prev,
        [openKey]: {
          ...current,
          form: { ...current.form, [key]: value },
        },
      };
    });
    if (formError) setFormError(null);
  };

  const saveEditor = async () => {
    if (!canSubmit) return;

    setIsSaving(true);
    setFormError(null);

    try {
      for (const draft of dirtyDrafts) {
        const response = await persistDraft(draft, selectedParentId);
        if (!response?.success) {
          setOpenKey(categoryDraftKey(draft.kind, draft.mode, draft.id));
          setFormError(
            response?.errors?.[0] ?? t("admin.categories_save_error"),
          );
          return;
        }
      }

      feedback.success(t("admin.categories_save_success"));
      clearDrafts();
      await loadParents();
      if (selectedParentId != null) {
        await loadChildren(selectedParentId);
      }
    } catch {
      setFormError(t("admin.categories_save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  const openDelete = (kind: CategoryKind, id: number, name: string) => {
    setDeleteTarget({ kind, id, name });
    setDeleteError(null);
  };

  const closeDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response =
        deleteTarget.kind === "parent"
          ? await menuCategoriesApi.deleteParent(deleteTarget.id)
          : await menuCategoriesApi.deleteChild(deleteTarget.id);

      if (!response.success) {
        setDeleteError(
          response.errors?.[0] ??
            response.message ??
            t("admin.categories_delete_error"),
        );
        return;
      }

      feedback.success(t("admin.categories_delete_success"));

      const key = categoryDraftKey(deleteTarget.kind, "edit", deleteTarget.id);
      setDrafts((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      if (openKey === key) setOpenKey(null);

      setDeleteTarget(null);

      if (deleteTarget.kind === "parent") {
        if (selectedParentId === deleteTarget.id) {
          setSelectedParentId(null);
          setChildren([]);
        }
        await loadParents();
      } else if (selectedParentId != null) {
        await loadChildren(selectedParentId);
      }
    } catch {
      setDeleteError(t("admin.categories_delete_error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    parents,
    children,
    selectedParentId,
    selectParent,
    isLoadingParents,
    isLoadingChildren,
    loadError,
    drafts,
    editor,
    form,
    setField,
    formError,
    isSaving,
    canSubmit,
    hasDrafts,
    openCreateParent,
    openCreateChild,
    openEdit,
    closeEditor,
    saveEditor,
    deleteTarget,
    isDeleting,
    deleteError,
    openDelete,
    closeDelete,
    confirmDelete,
    t,
  };
}
