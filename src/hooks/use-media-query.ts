import { useSyncExternalStore } from "react";

function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
  };

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 640px)");
}

export function useIsTablet(): boolean {
  return useMediaQuery("(max-width: 1024px)");
}
