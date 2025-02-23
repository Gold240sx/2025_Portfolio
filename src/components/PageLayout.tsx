"use client";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-white">
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
