export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">My Projects</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Card */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:scale-[1.02]">
            <h2 className="mb-2 text-2xl font-semibold">Project Name</h2>
            <p className="mb-4 text-gray-400">
              Project description goes here...
            </p>
            <div className="flex gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                React
              </span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                Node.js
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
