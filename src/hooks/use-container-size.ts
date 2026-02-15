import { useCallback, useRef, useState } from "react";

interface Size {
  width: number;
  height: number;
}

export function useContainerSize<T extends HTMLElement>(): [(node: T | null) => void, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      const updateSize = () => {
        setSize({
          width: node.clientWidth,
          height: node.clientHeight,
        });
      };

      updateSize();

      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(node);
      observerRef.current = resizeObserver;
    }
  }, []);

  return [ref, size];
}
