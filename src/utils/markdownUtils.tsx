/**
 * Markdown Utility - Simple markdown to JSX converter
 * Supports: bold, italic, code, lists, headings, links
 * Follows functional programming principles
 */

/**
 * Renders markdown text as JSX elements
 * @param text - Markdown formatted text
 * @returns Array of JSX elements
 */
export function renderMarkdown(text: string): JSX.Element[] {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = (key: number) => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${key}`} className="list-disc list-inside space-y-1 my-2 ml-4">
                    {listItems.map((item, idx) => (
                        <li key={idx} className="text-[#CCCCCC]">
                            {parseInline(item)}
                        </li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
            flushList(index);
            elements.push(<div key={`space-${index}`} className="h-2" />);
            return;
        }

        // Headings
        if (trimmed.startsWith('###')) {
            flushList(index);
            elements.push(
                <h3 key={`h3-${index}`} className="text-lg font-semibold text-[#FFFFFF] mt-3 mb-2">
                    {trimmed.substring(3).trim()}
                </h3>
            );
            return;
        }

        if (trimmed.startsWith('##')) {
            flushList(index);
            elements.push(
                <h2 key={`h2-${index}`} className="text-xl font-bold text-[#FFFFFF] mt-4 mb-2">
                    {trimmed.substring(2).trim()}
                </h2>
            );
            return;
        }

        if (trimmed.startsWith('#')) {
            flushList(index);
            elements.push(
                <h1 key={`h1-${index}`} className="text-2xl font-bold text-[#FFFFFF] mt-5 mb-3">
                    {trimmed.substring(1).trim()}
                </h1>
            );
            return;
        }

        // Lists
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
            const text = trimmed.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
            listItems.push(text);
            return;
        }

        // Regular paragraph
        flushList(index);
        elements.push(
            <p key={`p-${index}`} className="text-[#CCCCCC] text-sm leading-relaxed my-2">
                {parseInline(trimmed)}
            </p>
        );
    });

    flushList(lines.length);
    return elements;
}

/**
 * Parses inline markdown (bold, italic, code, links)
 * @param text - Text with inline markdown
 * @returns JSX with formatted inline elements
 */
function parseInline(text: string): JSX.Element[] {
    const parts: JSX.Element[] = [];
    let currentText = text;
    let key = 0;

    // Process inline elements in order: code, bold, italic, links
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(currentText)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(<span key={key++}>{currentText.substring(lastIndex, match.index)}</span>);
        }

        const matched = match[0];

        // Code
        if (matched.startsWith('`')) {
            const code = matched.slice(1, -1);
            parts.push(
                <code key={key++} className="bg-[#1a1a1a] text-[#A9B7C6] px-2 py-0.5 rounded text-xs font-mono">
                    {code}
                </code>
            );
        }
        // Bold
        else if (matched.startsWith('**')) {
            const bold = matched.slice(2, -2);
            parts.push(
                <strong key={key++} className="font-bold text-[#FFFFFF]">
                    {bold}
                </strong>
            );
        }
        // Italic
        else if (matched.startsWith('*')) {
            const italic = matched.slice(1, -1);
            parts.push(
                <em key={key++} className="italic text-[#E0E0E0]">
                    {italic}
                </em>
            );
        }
        // Link
        else if (matched.startsWith('[')) {
            const linkMatch = matched.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                parts.push(
                    <a
                        key={key++}
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6897BB] hover:text-[#87CEEB] underline"
                    >
                        {linkMatch[1]}
                    </a>
                );
            }
        }

        lastIndex = match.index + matched.length;
    }

    // Add remaining text
    if (lastIndex < currentText.length) {
        parts.push(<span key={key++}>{currentText.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : [<span key={0}>{text}</span>];
}
