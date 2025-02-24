"use client";

import { useState } from "react";
import { Navbar } from "~/components/Navbar";
import { AnimatePageTransition } from "~/components/AnimatePageTransition";
import { PageLayout } from "~/components/PageLayout";
import { PanelLeftDashed } from "lucide-react";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex min-h-screen w-screen flex-col">
      <main className="flex-1">
        <PageLayout>
          <AnimatePageTransition>
            <button
              className="hover:bg-accent fixed left-2 top-2 z-50 rounded-md bg-white p-1.5 shadow-black/30 md:hidden lg:hidden"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <PanelLeftDashed className="h-4 w-4" />
            </button>
            {children}
          </AnimatePageTransition>
        </PageLayout>
      </main>
    </div>
  );
}
