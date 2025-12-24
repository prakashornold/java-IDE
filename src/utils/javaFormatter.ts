export function formatJavaCode(code: string): string {
  let formattedCode = code;
  let indentLevel = 0;
  const lines = formattedCode.split('\n');
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line === '') {
      formattedLines.push('');
      continue;
    }

    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const indent = '    '.repeat(indentLevel);

    line = line
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, ' {')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s*%\s*/g, ' % ')
      .replace(/\s*==\s*/g, ' == ')
      .replace(/\s*!=\s*/g, ' != ')
      .replace(/\s*<=\s*/g, ' <= ')
      .replace(/\s*>=\s*/g, ' >= ')
      .replace(/\s*<\s*/g, ' < ')
      .replace(/\s*>\s*/g, ' > ')
      .replace(/\s*&&\s*/g, ' && ')
      .replace(/\s*\|\|\s*/g, ' || ');

    if (line.startsWith('}') && line.length > 1) {
      line = line.replace(/}\s*/, '} ');
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
