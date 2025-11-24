# Architecture Documentation

## Overview

This application has been refactored following professional best practices, SOLID principles, and clean architecture patterns. The codebase is now highly maintainable, testable, and extensible.

## Key Architectural Principles

### 1. SOLID Principles

#### Single Responsibility Principle (SRP)
- Each class and module has one clear responsibility
- Services handle business logic separately from UI components
- Repositories handle data access only

#### Open/Closed Principle (OCP)
- New database types can be added without modifying existing code
- Repository pattern allows for easy extension

#### Liskov Substitution Principle (LSP)
- All repositories implement the same interface
- Services work with interfaces, not concrete implementations

#### Interface Segregation Principle (ISP)
- Small, focused interfaces (IProblemRepository, ICompilerService)
- Clients depend only on methods they use

#### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (interfaces)
- Dependency injection through React Context

### 2. Design Patterns

#### Repository Pattern
- Abstracts data access logic
- Supports multiple database backends
- Location: `src/repositories/`

#### Factory Pattern
- Creates repository instances based on configuration
- Location: `src/repositories/ProblemRepositoryFactory.ts`

#### Dependency Injection
- Services injected via React Context
- Location: `src/context/ServiceContext.tsx`

#### Strategy Pattern
- Different database strategies (Supabase, PostgreSQL, etc.)
- Configurable via environment variables

## Project Structure

```
src/
├── config/                    # Configuration management
│   └── app.config.ts         # Centralized app configuration
├── context/                   # React Context providers
│   ├── ServiceContext.tsx    # Dependency injection for services
│   └── ThemeContext.tsx      # Theme management
├── repositories/              # Data access layer
│   ├── IProblemRepository.ts # Repository interface
│   ├── SupabaseProblemRepository.ts
│   └── ProblemRepositoryFactory.ts
├── services/                  # Business logic layer
│   ├── ICompilerService.ts   # Compiler service interface
│   ├── JavaCompilerService.ts
│   └── ProblemService.ts
├── types/                     # TypeScript type definitions
│   ├── compiler.types.ts
│   └── problem.types.ts
├── components/                # UI components
└── constants/                 # Application constants
```

## Configuration System

### Environment Variables

All external services are configurable via `.env`:

```env
# Database Configuration
VITE_DB_TYPE=supabase          # Database type: supabase, postgres, etc.
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Compiler Service
VITE_COMPILER_SERVICE_URL=     # Optional: custom compiler endpoint

# Theme
VITE_DEFAULT_THEME=dark        # dark or light

# Application
VITE_APP_NAME=...
VITE_APP_VERSION=...
```

### Adding a New Database

1. Create a new repository class implementing `IProblemRepository`:
```typescript
export class PostgresProblemRepository implements IProblemRepository {
  // Implement all interface methods
}
```

2. Register in `ProblemRepositoryFactory`:
```typescript
case 'postgres':
  return new PostgresProblemRepository(/* config */);
```

3. Update `.env`:
```env
VITE_DB_TYPE=postgres
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
```

## Features

### Theme System

- Dark/Light mode support
- Persists user preference
- CSS variables for consistent theming
- Toggle component in header

### Service Layer

**ProblemService**
- Business logic for problem management
- Uses repository for data access
- Handles code extraction and transformation

**JavaCompilerService**
- Compiles and executes Java code
- Error handling and timeout management
- Configurable endpoint

### Type Safety

- Comprehensive TypeScript types
- Interfaces for all contracts
- Type guards where needed

## Testing Strategy

### Unit Tests
- Test services with mocked repositories
- Test repositories with mocked clients
- Test components with mocked services

### Integration Tests
- Test service-repository integration
- Test component-service integration

### E2E Tests
- Test complete user workflows
- Test theme switching
- Test problem selection and compilation

## Best Practices Implemented

1. **Separation of Concerns**
   - UI, business logic, and data access are separate
   - Each layer has clear boundaries

2. **Dependency Injection**
   - Services injected via Context
   - Easy to test and mock

3. **Configuration Management**
   - Centralized configuration
   - Environment-based settings

4. **Error Handling**
   - Consistent error handling patterns
   - User-friendly error messages

5. **Type Safety**
   - Full TypeScript coverage
   - No `any` types

6. **Maintainability**
   - Small, focused files
   - Clear naming conventions
   - Comprehensive documentation

## Future Extensibility

### Easy to Add:
- New database backends
- New compiler services
- New problem sources
- Authentication system
- User progress tracking
- Problem difficulty algorithms

### How to Extend:

1. **New Database Type**
   - Implement `IProblemRepository`
   - Add to factory
   - Update configuration

2. **New Compiler**
   - Implement `ICompilerService`
   - Update service context
   - Configure endpoint

3. **New Features**
   - Add service method
   - Update types
   - Implement in components

## Performance Considerations

1. **Caching**
   - Problems cached in memory
   - Reduces database calls

2. **Lazy Loading**
   - Components loaded on demand
   - Improves initial load time

3. **Code Splitting**
   - Vite handles automatic code splitting
   - Optimized bundle size

## Security

1. **Environment Variables**
   - Sensitive data in `.env`
   - Never committed to repository

2. **Type Safety**
   - Prevents common bugs
   - Compile-time checks

3. **Input Validation**
   - All user inputs validated
   - Error boundaries in place

## Maintenance

### Adding Dependencies
```bash
npm install <package>
```

### Updating Dependencies
```bash
npm update
```

### Type Checking
```bash
npm run typecheck
```

### Building
```bash
npm run build
```

## Migration from Old Code

The refactoring maintains 100% functionality while improving:
- Code organization
- Testability
- Extensibility
- Maintainability
- Type safety
- Configuration management

All existing features work identically, with the same user experience.
