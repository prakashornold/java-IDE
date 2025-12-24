export function formatJavaCode(code: string): string {
  const lines = code.split('\n');
  const formattedLines: string[] = [];
  let indentLevel = 0;
  const INDENT = '    '; // 4 spaces
  const CONTINUATION_INDENT = '        '; // 8 spaces for method chaining

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines
    if (line === '') {
      formattedLines.push('');
      continue;
    }

    // Check if line starts with closing brace
    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Handle method chaining (streams, builder patterns, etc.)
    if (line.includes('.') && !line.startsWith('.')) {
      const chainPattern = /^([^.]+)(\..+)$/;
      const match = line.match(chainPattern);

      if (match) {
        const beforeChain = match[1].trim();
        const chainPart = match[2];

        // Split chain by dots followed by method calls
        const chainMethods = chainPart.split(/(?=\.[a-zA-Z_$][a-zA-Z0-9_$]*\()/);

        if (chainMethods.length > 1) {
          // Format the base part
          const formattedBase = formatLine(beforeChain);
          const baseIndent = INDENT.repeat(indentLevel);
          formattedLines.push(baseIndent + formattedBase);

          // Count braces in base to adjust indent level for chain
          const openBraces = (beforeChain.match(/{/g) || []).length;
          const closeBraces = (beforeChain.match(/}/g) || []).length;
          const bracesDiff = openBraces - closeBraces;

          // Format chained methods with continuation indent
          for (let j = 0; j < chainMethods.length; j++) {
            const method = chainMethods[j].trim();
            if (method) {
              const formattedMethod = formatLine(method);
              const chainIndent = INDENT.repeat(indentLevel + bracesDiff) + CONTINUATION_INDENT;
              formattedLines.push(chainIndent + formattedMethod);
            }
          }

          // Update indent level based on braces
          indentLevel = Math.max(0, indentLevel + bracesDiff);
          continue;
        }
      }
    }

    // Format regular line
    const formattedLine = formatLine(line);
    const indent = INDENT.repeat(indentLevel);
    formattedLines.push(indent + formattedLine);

    // Update indent level based on braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (!line.startsWith('}')) {
      indentLevel += openBraces - closeBraces;
    } else {
      // Already decremented at the start, so just add the net difference
      indentLevel += (openBraces - closeBraces);
    }

    indentLevel = Math.max(0, indentLevel);
  }

  return formattedLines.join('\n');
}

function formatLine(line: string): string {
  // Normalize whitespace
  let formatted = line.replace(/\s+/g, ' ').trim();

  // Space after keywords
  const keywords = ['if', 'for', 'while', 'switch', 'catch', 'synchronized'];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\(`, 'g');
    formatted = formatted.replace(regex, `${keyword} (`);
  });

  // Space before opening brace
  formatted = formatted.replace(/\s*{\s*/g, ' {');

  // Handle closing brace with following keyword/statement
  formatted = formatted.replace(/}\s*([a-zA-Z])/g, '} $1');

  // Space after comma
  formatted = formatted.replace(/,\s*/g, ', ');

  // Space around binary operators
  formatted = formatted.replace(/\s*([+\-*/%=<>!&|^]+)\s*/g, (match, operator) => {
    // Don't add spaces for unary operators or special cases
    if (operator === '++' || operator === '--') return operator;
    if (operator === '!') return operator;
    return ` ${operator} `;
  });

  // Fix double spaces
  formatted = formatted.replace(/\s{2,}/g, ' ');

  // No space before semicolon
  formatted = formatted.replace(/\s+;/g, ';');

  // No space inside parentheses (unless it's after a keyword)
  formatted = formatted.replace(/\(\s+/g, '(');
  formatted = formatted.replace(/\s+\)/g, ')');

  // Clean up space before opening paren in method calls (not after keywords)
  formatted = formatted.replace(/([a-zA-Z0-9_$>\])])\s+\(/g, '$1(');

  // Space after closing paren if followed by opening brace
  formatted = formatted.replace(/\)\s*{/g, ') {');

  return formatted.trim();
}
