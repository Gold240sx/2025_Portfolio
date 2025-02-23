import { Navbar } from "~/components/Navbar";
import { PageLayout } from "~/components/PageLayout";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen flex-col">
      <PageLayout>{children}</PageLayout>
    </div>
  );
}
