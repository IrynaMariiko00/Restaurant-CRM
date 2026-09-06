import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { getCategoryLabel } from "@/shared/menu/categoryCopy";
import type { MenuCategorySection } from "../hooks/useMenuCatalog";

type MenuCategoryTabsProps = {
  sections: MenuCategorySection[];
  activeId: number | null;
  tabsRef: RefObject<HTMLDivElement | null>;
  setTabButtonRef: (id: number, node: HTMLButtonElement | null) => void;
  onSelect: (id: number) => void;
};

export function MenuCategoryTabs({
  sections,
  activeId,
  tabsRef,
  setTabButtonRef,
  onSelect,
}: MenuCategoryTabsProps) {
  const { t, i18n } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mobileQuery = window.matchMedia("(max-width: 959.98px)");

    const updateStuck = () => {
      if (!mobileQuery.matches) {
        setIsStuck(false);
        return;
      }
      setIsStuck(wrap.getBoundingClientRect().top <= 0);
    };

    updateStuck();
    window.addEventListener("scroll", updateStuck, { passive: true });
    mobileQuery.addEventListener("change", updateStuck);

    return () => {
      window.removeEventListener("scroll", updateStuck);
      mobileQuery.removeEventListener("change", updateStuck);
    };
  }, []);

  if (sections.length === 0) return null;

  return (
    <div
      ref={wrapRef}
      className={`menu-tabs-wrap${isStuck ? " menu-tabs-wrap--stuck" : ""}`}
    >
      <div
        className="menu-tabs"
        role="tablist"
        aria-label={t("menu.tabs_label")}
      >
        <div ref={tabsRef} className="menu-tabs__scroller">
          {sections.map((section) => {
            const id = section.category.id;
            const label =
              getCategoryLabel(
                section.category,
                i18n.resolvedLanguage ?? i18n.language,
              ) || t("menu.untitled");
            const isActive = activeId === id;

            return (
              <button
                key={id}
                ref={(node) => setTabButtonRef(id, node)}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`menu-tabs__tab${isActive ? " menu-tabs__tab--active" : ""}`}
                onClick={() => onSelect(id)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
