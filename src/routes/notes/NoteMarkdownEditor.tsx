import { useCallback, useMemo, useRef, useState } from "react";

import { cn } from "@/utils/classnames";

const LINE_ROW_CLASS = "h-6 leading-6";
const PADDING_CLASS = "py-4";

function getLineFromOffset(text: string, offset: number): number {
  if (offset <= 0) return 1;
  let line = 1;
  for (let index = 0; index < offset && index < text.length; index++) {
    if (text[index] === "\n") line++;
  }
  return line;
}

function getLineCount(text: string): number {
  if (!text) return 1;
  return text.split("\n").length;
}

type NoteMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function NoteMarkdownEditor({ value, onChange, placeholder }: NoteMarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeLine, setActiveLine] = useState(1);

  const lineCount = useMemo(() => getLineCount(value), [value]);

  const updateActiveLine = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setActiveLine(getLineFromOffset(value, textarea.selectionStart));
  }, [value]);

  const lineRows = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, index) => {
        const lineNumber = index + 1;
        const isActive = lineNumber === activeLine;

        return (
          <div
            key={lineNumber}
            className={cn(
              LINE_ROW_CLASS,
              "pr-3 pl-2 text-right tabular-nums",
              isActive ? "bg-muted/50 text-foreground" : "text-muted-foreground",
            )}
          >
            {lineNumber}
          </div>
        );
      }),
    [activeLine, lineCount],
  );

  const highlightRows = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, index) => {
        const lineNumber = index + 1;
        return <div key={lineNumber} className={cn(LINE_ROW_CLASS, lineNumber === activeLine && "bg-muted/40")} />;
      }),
    [activeLine, lineCount],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full">
          <div className={cn(PADDING_CLASS, "shrink-0 select-none bg-muted/20 font-mono text-sm")}>{lineRows}</div>

          <div className="relative min-h-full min-w-0 flex-1">
            <div
              className={cn(PADDING_CLASS, "pointer-events-none absolute inset-0 overflow-hidden px-4 font-mono text-sm")}
            >
              {highlightRows}
            </div>
            <textarea
              ref={textareaRef}
              value={value}
              placeholder={placeholder}
              onChange={(event) => {
                onChange(event.target.value);
                setActiveLine(getLineFromOffset(event.target.value, event.target.selectionStart));
              }}
              onClick={updateActiveLine}
              onKeyUp={updateActiveLine}
              onSelect={updateActiveLine}
              className={cn(
                PADDING_CLASS,
                "field-sizing-content relative z-10 block min-h-full w-full resize-none border-0 bg-transparent px-4 font-mono text-sm leading-6 text-foreground shadow-none outline-none focus-visible:ring-0",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
