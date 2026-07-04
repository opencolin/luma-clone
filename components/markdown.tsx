import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders event descriptions. Luma events ship `description_md` (real markdown);
 * local events store plain text (which renders fine as markdown paragraphs).
 * Styled with a Luma-tuned prose theme.
 */
export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "prose-p:text-ink/90 prose-p:leading-relaxed",
        "prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-ink",
        "prose-a:text-brand prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-ink prose-strong:font-semibold",
        "prose-li:text-ink/90 prose-li:my-0.5",
        "prose-ul:my-3 prose-ol:my-3",
        "prose-img:rounded-xl prose-img:border prose-img:border-line",
        "prose-hr:border-line",
        "prose-blockquote:border-l-brand prose-blockquote:text-ink-secondary prose-blockquote:not-italic",
        "prose-code:rounded prose-code:bg-surface-2 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-[''] prose-code:after:content-['']",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Open external links in a new tab, keep them safe.
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
