import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { href: "/challenges", label: "Challenges" },
      { href: "/paths", label: "Learning Paths" },
      { href: "/showcase", label: "Showcase" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "https://github.com", label: "GitHub" },
      { href: "/showcase", label: "Projects" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-bold tracking-tight">AI In Action</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Learn AI by building real projects. From beginner to
              expert, one challenge at a time.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border/40 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI In Action. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
