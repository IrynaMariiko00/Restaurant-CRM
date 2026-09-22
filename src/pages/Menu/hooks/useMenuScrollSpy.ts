import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react";

type UseMenuScrollSpyOptions = {
  sectionIds: number[];
  enabled?: boolean;
};

export function useMenuScrollSpy({
  sectionIds,
  enabled = true,
}: UseMenuScrollSpyOptions) {
  const [activeId, setActiveId] = useState<number | null>(
    sectionIds[0] ?? null,
  );
  const sectionRefs = useRef(new Map<number, HTMLElement>());
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const ignoreSpyUntil = useRef(0);

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(null);
      return;
    }
    setActiveId((prev) =>
      prev != null && sectionIds.includes(prev) ? prev : sectionIds[0],
    );
  }, [sectionIds]);

  const onSpy = useEffectEvent((id: number) => {
    if (Date.now() < ignoreSpyUntil.current) return;
    setActiveId((prev) => (prev === id ? prev : id));
  });

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    const resolveActive = () => {
      const elements = sectionIds
        .map((id) => {
          const el = sectionRefs.current.get(id);
          return el ? { id, el } : null;
        })
        .filter((item): item is { id: number; el: HTMLElement } =>
          Boolean(item),
        );

      if (elements.length === 0) return;

      const scrollBottom =
        window.scrollY + document.documentElement.clientHeight;
      const docHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollBottom >= docHeight - 48;
      if (nearBottom) {
        onSpy(elements[elements.length - 1].id);
        return;
      }

      const marker = Math.min(window.innerHeight * 0.28, 180);
      let current = elements[0].id;

      for (const { id, el } of elements) {
        const top = el.getBoundingClientRect().top;
        if (top - marker <= 0) current = id;
        else break;
      }

      onSpy(current);
    };

    resolveActive();
    window.addEventListener("scroll", resolveActive, { passive: true });
    window.addEventListener("resize", resolveActive);
    return () => {
      window.removeEventListener("scroll", resolveActive);
      window.removeEventListener("resize", resolveActive);
    };
  }, [enabled, sectionIds]);

  useEffect(() => {
    if (activeId == null) return;
    const button = tabButtonRefs.current.get(activeId);
    const strip = tabsRef.current;
    if (!button || !strip) return;

    const pad = 24;
    const isVertical =
      window.matchMedia("(min-width: 960px)").matches ||
      getComputedStyle(strip).flexDirection === "column";

    if (isVertical) {
      const buttonTop = button.offsetTop;
      const buttonBottom = buttonTop + button.offsetHeight;
      const viewTop = strip.scrollTop;
      const viewBottom = viewTop + strip.clientHeight;

      if (buttonTop < viewTop + pad) {
        strip.scrollTo({
          top: Math.max(0, buttonTop - pad),
          behavior: "smooth",
        });
      } else if (buttonBottom > viewBottom - pad) {
        strip.scrollTo({
          top: buttonBottom - strip.clientHeight + pad,
          behavior: "smooth",
        });
      }
      return;
    }

    const buttonLeft = button.offsetLeft;
    const buttonRight = buttonLeft + button.offsetWidth;
    const viewLeft = strip.scrollLeft;
    const viewRight = viewLeft + strip.clientWidth;

    if (buttonLeft < viewLeft + pad) {
      strip.scrollTo({ left: Math.max(0, buttonLeft - pad), behavior: "smooth" });
    } else if (buttonRight > viewRight - pad) {
      strip.scrollTo({
        left: buttonRight - strip.clientWidth + pad,
        behavior: "smooth",
      });
    }
  }, [activeId]);

  const setSectionRef = (id: number, node: HTMLElement | null) => {
    if (node) sectionRefs.current.set(id, node);
    else sectionRefs.current.delete(id);
  };

  const setTabButtonRef = (id: number, node: HTMLButtonElement | null) => {
    if (node) tabButtonRefs.current.set(id, node);
    else tabButtonRefs.current.delete(id);
  };

  const scrollToCategory = (id: number) => {
    const section = sectionRefs.current.get(id);
    if (!section) return;

    ignoreSpyUntil.current = Date.now() + 700;
    setActiveId(id);

    const isDesktop = window.matchMedia("(min-width: 960px)").matches;
    const stickyTabs = tabsRef.current?.closest(".menu-tabs-wrap");
    const tabsHeight = isDesktop
      ? 0
      : stickyTabs instanceof HTMLElement
        ? stickyTabs.offsetHeight
        : (tabsRef.current?.offsetHeight ?? 0);
    const chromeOffset = isDesktop ? 88 : 12;
    const top =
      section.getBoundingClientRect().top +
      window.scrollY -
      tabsHeight -
      chromeOffset;

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return {
    activeId,
    tabsRef: tabsRef as RefObject<HTMLDivElement | null>,
    setSectionRef,
    setTabButtonRef,
    scrollToCategory,
  };
}
