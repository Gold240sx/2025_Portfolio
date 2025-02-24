import { Navbar } from "~/components/Navbar";
import { AnimatePageTransition } from "~/components/AnimatePageTransition";
import { PageLayout } from "~/components/PageLayout";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen flex-col">
      <main className="flex-1">
        <PageLayout>
          <AnimatePageTransition>{children}</AnimatePageTransition>
        </PageLayout>
      </main>
    </div>
  );
}
