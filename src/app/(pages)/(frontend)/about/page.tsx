export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-white">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold">About Me</h1>
        <div className="prose prose-invert">
          <p>
            Hello! I'm a developer passionate about building great web
            experiences.
          </p>
          {/* Add your content here */}
        </div>
      </div>
    </main>
  );
}
