# Backend Validation Scripts

This directory contains automated scripts to validate the e-commerce backend for the Tunisian e-commerce platform.

## Available Scripts

### 1. `validate-backend.sh`
Comprehensive validation script that checks:
- TypeScript compilation
- Linting
- Prisma schema validation
- Prisma client generation
- Build process
- Security checks

**Usage:**
```bash
./scripts/validate-backend.sh
```

### 2. `backend-health-check.sh`
Complete health check that validates:
- Node.js and npm installation
- Dependencies
- TypeScript configuration
- Prisma setup
- Environment variables
- TypeScript compilation
- Linting
- Prisma validation
- Build process

**Usage:**
```bash
./scripts/backend-health-check.sh
```

### 3. `check-typescript-errors.ts`
TypeScript error checker that parses and reports detailed TypeScript compilation errors.

**Usage:**
```bash
npx ts-node scripts/check-typescript-errors.ts
```

## Automated Validation Process

The validation scripts perform the following checks:

1. **Type Safety**: Ensures all TypeScript code compiles without errors
2. **Code Quality**: Runs linting to maintain coding standards
3. **Database Schema**: Validates Prisma schema integrity
4. **Client Generation**: Ensures Prisma client is properly generated
5. **Build Process**: Verifies the application builds successfully
6. **Security**: Checks for potential security vulnerabilities

## Exit Codes

- `0`: All validations passed
- `1`: One or more validations failed

## Integration

These scripts can be integrated into CI/CD pipelines to ensure code quality before deployment.

## Example Output

```
🔍 Starting backend validation...
✅ TypeScript compilation passed
✅ Linting passed
✅ Prisma schema is valid
✅ Prisma client generated successfully
✅ Build completed successfully

🎉 All validations passed! Backend is ready.
```

## Troubleshooting

If validation fails:
1. Check the error messages for specific issues
2. Fix TypeScript compilation errors
3. Address linting issues
4. Validate Prisma schema changes
5. Re-run the validation scripts

## Best Practices

- Run validation scripts before committing code
- Integrate validation into CI/CD pipelines
- Address all warnings and errors promptly
- Keep dependencies up to date
- Maintain clean, type-safe code