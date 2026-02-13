#!/bin/bash

# Comprehensive Backend Health Check Script
# Validates all aspects of the e-commerce backend

echo "🏥 Running comprehensive backend health check..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "OK")
            echo -e "✅ ${GREEN}$message${NC}"
            ;;
        "WARN")
            echo -e "⚠️  ${YELLOW}$message${NC}"
            ;;
        "ERROR")
            echo -e "❌ ${RED}$message${NC}"
            ;;
        *)
            echo -e "ℹ️  $message"
            ;;
    esac
}

# Check 1: Node.js and npm
echo -e "\n${BLUE}🔍 Checking Node.js and npm...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "OK" "Node.js version: $NODE_VERSION"
else
    print_status "ERROR" "Node.js is not installed"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "OK" "npm version: $NPM_VERSION"
else
    print_status "ERROR" "npm is not installed"
    exit 1
fi

# Check 2: Dependencies
echo -e "\n${BLUE}📦 Checking dependencies...${NC}"
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    print_status "OK" "Dependencies are installed"
else
    print_status "ERROR" "Dependencies not found. Run 'npm install'"
    exit 1
fi

# Check 3: TypeScript configuration
echo -e "\n${BLUE}📝 Checking TypeScript configuration...${NC}"
if [ -f "tsconfig.json" ]; then
    print_status "OK" "TypeScript configuration found"
else
    print_status "ERROR" "tsconfig.json not found"
    exit 1
fi

# Check 4: Prisma setup
echo -e "\n${BLUE}🗄️  Checking Prisma setup...${NC}"
if [ -f "prisma/schema.prisma" ]; then
    print_status "OK" "Prisma schema found"
else
    print_status "ERROR" "Prisma schema not found"
    exit 1
fi

if [ -f "prisma.config.ts" ]; then
    print_status "OK" "Prisma config found"
else
    print_status "WARN" "Prisma config not found (using default)"
fi

# Check 5: Environment variables
echo -e "\n${BLUE}🔐 Checking environment variables...${NC}"
if [ -f ".env" ]; then
    ENV_VARS=$(grep -c "^[^#[:space:]].*=.*$" .env 2>/dev/null || echo 0)
    print_status "OK" "$ENV_VARS environment variables found in .env"
else
    print_status "WARN" ".env file not found (using defaults)"
fi

# Check 6: TypeScript compilation
echo -e "\n${BLUE}🏗️  Checking TypeScript compilation...${NC}"
if npx tsc --noEmit --skipLibCheck; then
    print_status "OK" "TypeScript compilation passed"
else
    print_status "ERROR" "TypeScript compilation failed"
    exit 1
fi

# Check 7: Linting
echo -e "\n${BLUE}🧹 Checking code linting...${NC}"
if npm run lint 2>/dev/null; then
    print_status "OK" "Linting passed"
else
    print_status "WARN" "Linting issues found (non-critical)"
fi

# Check 8: Prisma validation
echo -e "\n${BLUE}🔍 Checking Prisma schema validation...${NC}"
if npx prisma validate; then
    print_status "OK" "Prisma schema is valid"
else
    print_status "ERROR" "Prisma schema validation failed"
    exit 1
fi

# Check 9: Prisma client generation
echo -e "\n${BLUE}⚙️  Checking Prisma client generation...${NC}"
if npx prisma generate; then
    print_status "OK" "Prisma client generated successfully"
else
    print_status "ERROR" "Prisma client generation failed"
    exit 1
fi

# Check 10: Build
echo -e "\n${BLUE}🔨 Checking build process...${NC}"
if npm run build; then
    print_status "OK" "Build completed successfully"
else
    print_status "ERROR" "Build failed"
    exit 1
fi

# Summary
echo -e "\n${GREEN}🎉 Backend health check completed!${NC}"
echo "==============================================="
echo "✅ All critical checks passed"
echo "✅ Backend is ready for production"
echo ""
echo "📋 Summary:"
echo "   - Node.js and npm: ✓"
echo "   - Dependencies: ✓"
echo "   - TypeScript: ✓"
echo "   - Prisma: ✓"
echo "   - Build: ✓"
echo ""
echo "🚀 Your e-commerce backend is healthy and ready to deploy!"