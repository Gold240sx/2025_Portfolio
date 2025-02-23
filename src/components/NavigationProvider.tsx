"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useRef } from "react";

const NavigationContext = createContext<{
  startViewTransition: (callback: () => void) => void;
}>({
  startViewTransition: () => {},
});

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isTransitioning = useRef(false);

  const startViewTransition = useCallback(
    (callback: () => void) => {
      if (!document.startViewTransition || isTransitioning.current) {
        callback();
        return;
      }

      isTransitioning.current = true;
      document.startViewTransition(() => {
        callback();
        isTransitioning.current = false;
      });
    },
    [isTransitioning],
  );

  return (
    <NavigationContext.Provider value={{ startViewTransition }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
