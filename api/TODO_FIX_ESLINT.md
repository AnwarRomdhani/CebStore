# ESLint/TypeScript Errors Fix Plan

## Summary of Issues Found:

### Flouci Controller (flouci.controller.ts):
1. **Missing module**: Cannot find `./dto/create-payment.dto` - DTO file doesn't exist
2. **Line 28**: `handleWebhook` is async but has no await expression
3. **Line 28**: `webhookData` is defined but never used
4. **Lines 13-14**: Type errors with error.code (number) and error.message (string)

### Flouci Module (flouci.module.ts):
- **Line 12**: `configService` is defined but never used

### Carts Controller (carts.controller.ts):
- **Multiple lines (45, 57, 73, 93, 114, 128, 141, 155)**: Unsafe argument of type `any` assigned to parameter of type `string` - `req.user.userId` needs proper typing

### Carts Service (carts.service.ts):
- **Line 432**: Unsafe argument in `mapToCartItemDto` - `cartItem: any` needs proper typing
- **Line 442**: Unsafe argument in `calculateDiscount` - `discount: any` needs proper typing

---

## Fix Plan:

### 1. Create `api/src/modules/payments/flouci/dto/create-payment.dto.ts`
- Create proper DTO with amount and orderId fields

### 2. Fix Flouci Controller
- Use proper import for CreatePaymentDto
- Fix type issues on lines 13-14
- Add proper webhook handling or remove async keyword
- Use or prefix webhookData with underscore

### 3. Fix Flouci Module  
- Prefix unused configService with underscore: `_configService`

### 4. Fix Carts Controller
- Import `RequestWithUser` interface
- Change `@Request() req` to `@Request() req: RequestWithUser`
- Or use `get-user` decorator for cleaner typing

### 5. Fix Carts Service
- Type `cartItem` parameter in `mapToCartItemDto` properly
- Type `discount` parameter in `calculateDiscount` properly

---

## Implementation Order:
1. Create create-payment.dto.ts
2. Fix flouci.controller.ts
3. Fix flouci.module.ts
4. Fix carts.controller.ts
5. Fix carts.service.ts

