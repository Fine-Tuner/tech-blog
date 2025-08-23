import { useCallback, useEffect, useMemo, useState } from "react";
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
  offset = 120,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const computeActive = () => {
      const candidates = headings
        .map((h) => {
          const el = document.getElementById(h.id);
          if (!el) return { id: h.id, top: Number.POSITIVE_INFINITY };
          const top = el.getBoundingClientRect().top;
          return { id: h.id, top };
        })
        .filter((x) => x.top - offset <= 0)
        .sort((a, b) => b.top - a.top);

      if (candidates.length > 0) {
        setActiveId(candidates[0].id);
        return;
      }

      setActiveId(headings[0]?.id ?? null);
    };

    const onWinScroll = () => computeActive();
    window.addEventListener("scroll", onWinScroll, { passive: true });
    const interval = window.setInterval(computeActive, 200);
    computeActive();

    return () => {
      window.removeEventListener("scroll", onWinScroll);
      window.clearInterval(interval);
    };
  }, [headings, offset]);

  return activeId;
}

export default function TOC({ title }: { title?: string }) {
  const article = useArticle();
  const headings = useHeadingsFromArticle(article);
  const show = useShowAfterScroll(article, 200);
  const activeId = useActiveHeading(headings, 120);

  const items = useMemo(() => headings, [headings]);

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
      <div id="toc-content" className={styles.content}>
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
