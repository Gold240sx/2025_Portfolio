"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-white">
      <div className="container mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold">Contact Me</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-white/10 px-6 py-2 font-semibold text-white transition-colors hover:bg-white/20"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
