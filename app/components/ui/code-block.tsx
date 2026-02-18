import * as React from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  showCopy?: boolean;
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ code, language = "bash", showCopy = true, className = "", ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative group">
        <pre
          ref={ref}
          className={`overflow-x-auto rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-sm text-slate-300 ${className}`}
          {...props}
        >
          <code>{code}</code>
        </pre>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-700 hover:text-white"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
