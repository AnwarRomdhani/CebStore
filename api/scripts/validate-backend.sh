echo "🔍 Starting backend validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking TypeScript compilation...${NC}"
if npx tsc --noEmit; then
    echo -e "${GREEN}✓ TypeScript compilation passed${NC}"
else
    echo -e "${RED}✗ TypeScript compilation failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Step 2: Running linting...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${RED}✗ Linting failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Step 3: Checking Prisma schema...${NC}"
if npx prisma validate; then
    echo -e "${GREEN}✓ Prisma schema is valid${NC}"
else
    echo -e "${RED}✗ Prisma schema validation failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Step 4: Generating Prisma client...${NC}"
if npx prisma generate; then
    echo -e "${GREEN}✓ Prisma client generated successfully${NC}"
else
    echo -e "${RED}✗ Prisma client generation failed${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Step 5: Checking for security issues...${NC}"
if command -v npm-audit &> /dev/null; then
    npm audit
else
    echo "⚠ npm audit not available, skipping security check"
fi

echo -e "\n${YELLOW}Step 6: Running build...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 All validations passed! Backend is ready.${NC}"

echo -e "\n${YELLOW}Summary:${NC}"
echo "✅ TypeScript compilation: OK"
echo "✅ Linting: OK" 
echo "✅ Prisma schema: OK"
echo "✅ Prisma client generation: OK"
echo "✅ Build: OK"
echo ""
echo "The backend is ready for deployment!"