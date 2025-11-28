# JavaCodingPractice.com - Online Java Compiler & Runner

A beautiful, production-ready online Java IDE at JavaCodingPractice.com that allows developers to write, compile, and run Java code instantly in the browser.

## Features

- **Monaco Editor** - Full VS Code editor experience with syntax highlighting, IntelliSense, and auto-completion
- **Instant Compilation** - Compile and run Java code with a single click or Ctrl+Enter
- **Beautiful UI** - Clean, modern dark theme with excellent contrast
- **Real-time Output** - See your program output instantly with proper formatting
- **Error Handling** - Clear display of compilation and runtime errors
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Zero Setup** - No installation required, works entirely in the browser

## Tech Stack

- React 18 + TypeScript
- Monaco Editor (same as VS Code)
- Vite (lightning-fast build tool)
- Tailwind CSS
- Axios for API calls
- Codingshuttle Quick Compiler API

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Keyboard Shortcuts

- `Ctrl+Enter` (or `Cmd+Enter` on Mac) - Run code

## API Integration

The IDE uses the Codingshuttle Quick Compiler API:
- Endpoint: `https://api.codingshuttle.com/api/classroom/quickCompiler/run`
- Supports Java compilation and execution
- Returns formatted output or error messages

## Project Structure

```
src/
├── components/         # React components
│   ├── Header.tsx     # Top navigation with Run button
│   ├── CodeEditor.tsx # Monaco editor wrapper
│   └── OutputPanel.tsx # Output console
├── services/          # API integration
│   └── compilerService.ts
├── constants/         # Default code and constants
│   └── defaultCode.ts
├── App.tsx           # Main application
└── main.tsx          # Entry point
```

## Default Example

The IDE comes pre-loaded with a comprehensive Employee Management System example demonstrating:
- Class hierarchy and inheritance
- Method overriding
- Object-oriented programming concepts
- Formatted console output

## License

MIT
