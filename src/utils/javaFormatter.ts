export function formatJavaCode(code: string): string {
  let indentLevel = 0;
  const lines = code.split('\n');
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === '') {
      formattedLines.push('');
      continue;
    }

    // Handle stream method chaining - split on dots that are followed by method calls
    if (line.includes('.') && !line.startsWith('.')) {
      const streamPattern = /(\.)([a-zA-Z]+\()/g;
      const matches = [...line.matchAll(streamPattern)];

      if (matches.length > 0) {
        const parts: string[] = [];
        let lastIndex = 0;

        for (const match of matches) {
          const dotIndex = match.index!;
          parts.push(line.substring(lastIndex, dotIndex));
          lastIndex = dotIndex;
        }
        parts.push(line.substring(lastIndex));

        if (parts.length > 1 && parts[0].trim().length > 0) {
          const openBraces = (parts[0].match(/{/g) || []).length;
          const closeBraces = (parts[0].match(/}/g) || []).length;

          if (parts[0].trim().startsWith('}')) {
            indentLevel = Math.max(0, indentLevel - 1);
          }

          const indent = '    '.repeat(indentLevel);
          const baseIndentLength = indent.length;
          const continuationSpaces = Math.max(2, Math.floor(baseIndentLength * 0.3));

          formattedLines.push(indent + parts[0].trim());

          if (!parts[0].trim().startsWith('}')) {
            indentLevel += openBraces;
          } else {
            indentLevel += (openBraces - closeBraces + 1);
          }

          for (let j = 1; j < parts.length; j++) {
            if (parts[j].trim().length > 0) {
              const chainIndent = '    '.repeat(indentLevel) + ' '.repeat(continuationSpaces);
              formattedLines.push(chainIndent + parts[j].trim());
            }
          }
          continue;
        }
      }
    }

    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indent = '    '.repeat(indentLevel);

    // Remove extra spaces but keep single spaces between keywords/identifiers
    line = line
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*;\s*/g, ';');

    if (line.startsWith('}') && line.length > 1) {
      line = line.replace(/}/, '} ');
    }

    formattedLines.push(indent + line);

    if (!line.startsWith('}')) {
      indentLevel += openBraces;
    } else {
      indentLevel += (openBraces - closeBraces + 1);
    }

    indentLevel = Math.max(0, indentLevel);
  }

  return formattedLines.join('\n');
}
