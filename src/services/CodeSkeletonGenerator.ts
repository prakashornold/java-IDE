/**
 * Service for generating skeleton code from complete Java solutions
 * Follows Single Responsibility Principle - dedicated to code structure extraction
 */
export class CodeSkeletonGenerator {
    /**
     * Generates skeleton code with empty method bodies
     * @param fullCode Complete solution code with implementations
     * @returns Code with method signatures but empty bodies
     */
    generateSkeleton(fullCode: string): string {
        if (!fullCode || fullCode.trim().length === 0) {
            return fullCode;
        }

        try {
            return this.processJavaCode(fullCode);
        } catch (error) {
            console.error('Error generating skeleton code:', error);
            return fullCode; // Fallback to original code on error
        }
    }

    /**
     * Processes Java code to extract structure and create skeleton
     * @param code Original Java code
     * @returns Skeleton code with empty method bodies
     */
    private processJavaCode(code: string): string {
        const lines = code.split('\n');
        const result: string[] = [];
        let bracketDepth = 0;
        let insideMethod = false;
        let methodStartBracketDepth = 0;
        let currentIndentation = '';
        let skipUntilClosingBrace = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // Count brackets before processing
            const openBrackets = (line.match(/{/g) || []).length;
            const closeBrackets = (line.match(/}/g) || []).length;

            // Check if this line is a method signature
            const isMethodSignature = this.isMethodSignature(trimmedLine, bracketDepth);

            if (isMethodSignature && trimmedLine.endsWith('{')) {
                // Method signature with opening bracket on same line
                insideMethod = true;
                skipUntilClosingBrace = true;
                methodStartBracketDepth = bracketDepth + 1; // After the opening bracket
                currentIndentation = this.getIndentation(line);

                result.push(line);
                // Add TODO comment
                result.push(currentIndentation + '    // TODO: Implement this method');

            } else if (isMethodSignature && !trimmedLine.endsWith('{')) {
                // Method signature without opening bracket (next line)
                result.push(line);
                insideMethod = true;
                methodStartBracketDepth = bracketDepth;
                currentIndentation = this.getIndentation(line);

            } else if (insideMethod && trimmedLine === '{' && !skipUntilClosingBrace) {
                // Opening bracket on separate line
                result.push(line);
                skipUntilClosingBrace = true;
                methodStartBracketDepth = bracketDepth + 1;
                result.push(currentIndentation + '    // TODO: Implement this method');

            } else if (skipUntilClosingBrace) {
                // Skip method body lines, but keep track of brackets
                // We need to find the closing bracket of the method
                const newDepth = bracketDepth + openBrackets - closeBrackets;

                // If we're back to the method's bracket depth, this is the closing brace
                if (newDepth < methodStartBracketDepth ||
                    (newDepth === methodStartBracketDepth - 1 && trimmedLine.startsWith('}'))) {
                    result.push(line); // Add closing bracket
                    insideMethod = false;
                    skipUntilClosingBrace = false;
                }

            } else if (!insideMethod) {
                // Not inside a method - keep the line (class declaration, imports, etc.)
                result.push(line);
            }

            // Update bracket depth after processing
            bracketDepth += openBrackets - closeBrackets;
        }

        return result.join('\n');
    }

    /**
     * Checks if a line is a method signature
     * @param line Trimmed line of code
     * @param bracketDepth Current bracket nesting depth
     * @returns True if line is a method signature
     */
    private isMethodSignature(line: string, bracketDepth: number): boolean {
        // Must be inside a class (bracketDepth >= 1)
        if (bracketDepth < 1) {
            return false;
        }

        // Ignore empty lines, comments, and closing brackets
        if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line === '}') {
            return false;
        }

        // Check for method patterns
        const methodPattern = /^(public|private|protected|static|\s)+([\w\<\>\[\]]+)\s+(\w+)\s*\([^)]*\)\s*(\{)?/;
        const isMethod = methodPattern.test(line);

        // Exclude class declarations
        const isClassDeclaration = line.includes('class ') && line.includes('{');

        return isMethod && !isClassDeclaration;
    }

    /**
     * Extracts the indentation (leading whitespace) from a line
     * @param line Line of code
     * @returns Indentation string
     */
    private getIndentation(line: string): string {
        const match = line.match(/^(\s*)/);
        return match ? match[1] : '';
    }
}

/**
 * Singleton instance of the skeleton generator
 */
export const codeSkeletonGenerator = new CodeSkeletonGenerator();
