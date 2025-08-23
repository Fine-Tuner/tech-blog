import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./toc.module.css";

type HeadingItem = {
  id: string;
  text: string;
  level: number; // 2 | 3 | 4 ...
};

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    // remove punctuation but keep unicode letters/numbers/spaces/hyphens
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return base || "heading";
}

function useArticle(): HTMLElement | null {
  const [article, setArticle] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setArticle(document.querySelector("article"));
  }, []);

  return article;
}

function ensureHeadingIds(elements: HTMLHeadingElement[]): HeadingItem[] {
  const usedIds = new Set<string>();
  return elements.map((el) => {
    if (!el.id) {
      const tentative = slugify(el.textContent || "");
      let uid = tentative;
      let index = 1;
      while (usedIds.has(uid) || document.getElementById(uid)) {
        uid = `${tentative}-${index++}`;
      }
      el.id = uid;
      usedIds.add(uid);
    } else {
      usedIds.add(el.id);
    }

    const level = Number(el.tagName.substring(1)) || 2;
    return { id: el.id, text: el.textContent || "", level };
  });
}

function useHeadingsFromArticle(article: HTMLElement | null): HeadingItem[] {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    if (!article) return;
    const found = [...article.querySelectorAll<HTMLHeadingElement>("h2, h3")];
    setHeadings(ensureHeadingIds(found));
  }, [article]);

  return headings;
}

function useShowAfterScroll(
  article: HTMLElement | null,
  threshold = 200,
): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!article) return;

    const updateShow = () => {
      const top = article.getBoundingClientRect().top;
      setShow(-top >= threshold);
    };

    updateShow();
    const onWinScroll = () => updateShow();
    window.addEventListener("scroll", onWinScroll, { passive: true });
    const interval = window.setInterval(updateShow, 200);

    return () => {
      window.removeEventListener("scroll", onWinScroll);
      window.clearInterval(interval);
    };
  }, [article, threshold]);

  return show;
}

function useActiveHeading(
  headings: HeadingItem[],
  offset?: number,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const computeActive = () => {
      const refY =
        typeof offset === "number"
          ? offset
          : Math.round(window.innerHeight / 2);
      const positions = headings.map((h) => {
        const el = document.getElementById(h.id);
        if (!el)
          return {
            id: h.id,
            top: Number.POSITIVE_INFINITY,
            delta: Number.POSITIVE_INFINITY,
          };
        const top = el.getBoundingClientRect().top;
        const delta = top - refY;
        return { id: h.id, top, delta };
      });

      const above = positions.filter((p) => p.delta <= 0);
      const below = positions.filter((p) => p.delta > 0);

      if (above.length > 0) {
        // 가장 참조선(refY)에 가까운 위쪽 헤딩
        const pick = above.reduce((acc, cur) =>
          cur.delta > acc.delta ? cur : acc,
        );
        setActiveId(pick.id);
        return;
      }

      if (below.length > 0) {
        // 아직 첫 헤딩 전에 있는 경우: 가장 가까운 아래 헤딩
        const pick = below.reduce((acc, cur) =>
          cur.delta < acc.delta ? cur : acc,
        );
        setActiveId(pick.id);
        return;
      }

      setActiveId(headings[headings.length - 1]?.id ?? null);
    };

    const onWinScroll = () => computeActive();
    const onResize = () => computeActive();
    window.addEventListener("scroll", onWinScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const interval = window.setInterval(computeActive, 200);
    computeActive();

    return () => {
      window.removeEventListener("scroll", onWinScroll);
      window.removeEventListener("resize", onResize);
      window.clearInterval(interval);
    };
  }, [headings, offset]);

  return activeId;
}

export default function TOC({ title }: { title?: string }) {
  const article = useArticle();
  const headings = useHeadingsFromArticle(article);
  const show = useShowAfterScroll(article, 200);
  const activeId = useActiveHeading(headings);

  const listRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => headings, [headings]);

  useEffect(() => {
    if (!activeId) return;
    const container = listRef.current || document.getElementById("toc-content");
    if (!container) return;
    const safeId = (window as any).CSS?.escape
      ? (window as any).CSS.escape(activeId)
      : activeId;
    const link = container.querySelector(
      `a[href="#${safeId}"]`,
    ) as HTMLElement | null;
    link?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [activeId]);

  const scrollWithOffset = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const root =
      (document.querySelector('[data-scroll-root="true"]') as HTMLElement) ||
      document.scrollingElement ||
      document.documentElement;

    const currentScrollTop =
      root === document.documentElement ? window.scrollY : root.scrollTop;
    const y = el.getBoundingClientRect().top + currentScrollTop - 100;

    if (root === document.documentElement) {
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      root.scrollTo({ top: y, behavior: "smooth" as ScrollBehavior });
    }
  }, []);

  if (!items.length) return null;

  return (
    <nav
      aria-label="목차"
      className={`${styles.toc} ${show ? "" : styles.hidden}`}
    >
      <div className={styles.headerRow}>
        <div className={styles.title}>{title ?? "Contents"}</div>
      </div>
      <div id="toc-content" className={styles.content} ref={listRef}>
        <ul className={styles.list}>
          {items.map((h) => (
            <li
              key={h.id}
              className={`${styles.item} ${h.level > 2 ? styles[`indent${h.level}` as const] : ""}`}
            >
              <a
                href={`#${h.id}`}
                className={`${styles.link} ${activeId === h.id ? styles.active : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollWithOffset(h.id);
                }}
                aria-current={activeId === h.id ? "true" : undefined}
                aria-label={h.text}
              >
                <span className={styles.bar} aria-hidden="true" />
                <span className={styles.label}>{h.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
