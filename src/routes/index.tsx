import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Starter App — Blank Canvas" },
      {
        name: "description",
        content: "A clean, blank starter app ready for your first feature.",
      },
      { property: "og:title", content: "Starter App — Blank Canvas" },
      {
        property: "og:description",
        content: "A clean, blank starter app ready for your first feature.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
        Starter
      </span>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Your blank canvas
      </h1>
      <p className="max-w-md text-sm text-muted-foreground sm:text-base">
        Everything is set up and nothing is in your way. Describe what you want
        to build and it starts here.
      </p>
    </main>
  );
}
