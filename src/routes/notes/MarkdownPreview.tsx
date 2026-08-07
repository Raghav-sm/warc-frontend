import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/utils/classnames";

export const markdownPreviewClassName = cn(
  "space-y-3 text-sm leading-relaxed",
  "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight",
  "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:text-lg [&_h3]:font-semibold",
  "[&_h4]:text-base [&_h4]:font-semibold",
  "[&_h5]:text-sm [&_h5]:font-semibold",
  "[&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-muted-foreground",
  "[&_p]:leading-relaxed",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
  "[&_hr]:my-4 [&_hr]:border-border",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1",
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1",
  "[&_li]:leading-relaxed",
  "[&_li>input[type=checkbox]]:mr-2 [&_li>input[type=checkbox]]:align-middle",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_thead]:bg-muted/50",
  "[&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium",
  "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
  "[&_tbody_tr:nth-child(even)]:bg-muted/20",
  "[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
);

function MarkdownLink({ href, children, ...props }: ComponentProps<"a">) {
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");

  return (
    <a href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
      {children}
    </a>
  );
}

function MarkdownTable({ children, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  );
}

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={cn(markdownPreviewClassName, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: MarkdownLink,
          table: MarkdownTable,
        }}
      >
        {content || "*Nothing to preview yet.*"}
      </ReactMarkdown>
    </div>
  );
}
