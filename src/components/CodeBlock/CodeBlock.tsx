import { useState } from 'preact/hooks';
import './CodeBlock.css';

interface CodeBlockProps {
  /** The exact text the Copy button puts on the clipboard. */
  code: string;
  /** Short label above the block: a file name, "shell", "nginx.conf". */
  label?: string;
  /** Shell commands get a "$" prompt per line (not copied). */
  shell?: boolean;
}

/**
 * A copyable code block in the site's terminal style (`.code`). The label
 * names what the text is or where it goes; the Copy button copies exactly
 * `code`, without prompts.
 */
export function CodeBlock({ code, label, shell }: CodeBlockProps) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
    window.setTimeout(() => setCopied('idle'), 1800);
  };
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <div class="codeblock">
      <div class="codeblock-bar">
        <span class="codeblock-label">{label ?? (shell ? 'shell' : 'text')}</span>
        <button type="button" class="codeblock-copy" onClick={copy} aria-label={label ? `Copy ${label}` : 'Copy'}>
          {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Select and copy' : 'Copy'}
        </button>
        <span class="sr-only" aria-live="polite">{copied === 'ok' ? 'Copied to the clipboard' : ''}</span>
      </div>
      <pre class="code codeblock-pre">
        <code>
          {lines.map((l, i) => (
            <span key={i} class={shell && l.trim() !== '' && !l.startsWith('#') && !l.startsWith(' ') ? 'codeblock-line prompt' : 'codeblock-line'}>
              {shell && l.startsWith('#') ? <span class="c-cmt">{l}</span> : l}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
