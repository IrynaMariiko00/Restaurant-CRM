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

  const onIntersect = useEffectEvent((id: number) => {
    if (Date.now() < ignoreSpyUntil.current) return;
    setActiveId(id);
  });

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => sectionRefs.current.get(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        const top = visible[0];
        if (!top) return;
        const id = Number(
          (top.target as HTMLElement).dataset.categoryId,
        );
        if (Number.isFinite(id)) onIntersect(id);
      },
      {
        root: null,
        rootMargin: "-28% 0px -55% 0px",
        threshold: [0, 0.15, 0.4],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
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
