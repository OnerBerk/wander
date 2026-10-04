import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 25;

export const useIncrementalList = <T>(items: readonly T[]) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [items]);

  const hasMore = visibleCount < items.length;

  useEffect(() => {
    const node = sentinelRef.current;
    const root = scrollerRef.current;
    if (!node || !root || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleCount((current) => Math.min(current + PAGE_SIZE, items.length));
      },
      { root, rootMargin: '400px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, items.length]);

  return {
    visibleItems: items.slice(0, visibleCount),
    sentinelRef,
    scrollerRef,
    hasMore,
  };
};
