# Content Security Policy (CSP) Security Recommendations

## Current Issues Fixed
✅ Added `https://www.clarity.ms` to script-src and connect-src directives
✅ Added missing analytics domains to connect-src
✅ Added form-action directive for better form security

## Remaining Security Concerns

### High Priority Issues

1. **'unsafe-inline' in script-src**
   - **Risk**: Allows execution of inline JavaScript, which is a major XSS vulnerability
   - **Solution**: Implement CSP nonces or hashes for inline scripts
   - **Implementation Steps**:
     ```javascript
     // In your Astro config or middleware
     const nonce = crypto.randomBytes(16).toString('base64');
     // Add nonce to all inline scripts: <script nonce="${nonce}">
     // Update CSP: script-src 'self' 'nonce-${nonce}'
     ```

2. **'unsafe-eval' in script-src**
   - **Risk**: Allows use of eval() and similar functions
   - **Solution**: Remove if not needed by Google Analytics or other scripts
   - **Check**: Test site functionality without 'unsafe-eval'

3. **'unsafe-inline' in style-src**
   - **Risk**: Allows inline styles which could be exploited
   - **Solution**: Use CSP hashes for critical inline styles or move all styles to external files

## Recommended CSP Implementation

### Step 1: Audit Current Inline Scripts
```bash
# Find all inline scripts in your codebase
grep -r "<script>" src/ --include="*.astro" --include="*.tsx" | grep -v "src="
```

### Step 2: Implement Nonce-Based CSP (Recommended)

Create a middleware to add nonces:

```typescript
// src/middleware.ts
import type { MiddlewareHandler } from 'astro';
import crypto from 'crypto';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  context.locals.nonce = nonce;
  
  const response = await next();
  
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; ` +
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms; ` +
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ` +
    `font-src 'self' https://fonts.gstatic.com; ` +
    `img-src 'self' data: https: blob:; ` +
    `connect-src 'self' https://*.google-analytics.com https://www.clarity.ms; ` +
    `frame-src 'self' https://www.google.com https://www.clarity.ms; ` +
    `object-src 'none'; ` +
    `base-uri 'self'; ` +
    `form-action 'self';`
  );
  
  return response;
};
```

### Step 3: Update All Inline Scripts

In your Astro components:
```astro
---
const nonce = Astro.locals.nonce;
---

<script nonce={nonce}>
  // Your inline JavaScript
</script>
```

### Step 4: Use Hash-Based CSP for Static Scripts (Alternative)

If nonces are not feasible, use hashes for known inline scripts:

1. Generate hash for each inline script:
```bash
echo -n "console.log('hello');" | openssl dgst -sha256 -binary | openssl base64
```

2. Add to CSP:
```
script-src 'self' 'sha256-[generated-hash]' ...
```

## Testing CSP Changes

1. **Use Report-Only Mode First**:
   ```
   Content-Security-Policy-Report-Only: [your policy]
   ```

2. **Monitor Console for Violations**:
   - Check browser console for CSP violations
   - Fix any legitimate scripts being blocked

3. **Use CSP Evaluator**:
   - Visit: https://csp-evaluator.withgoogle.com/
   - Paste your CSP policy for analysis

## Gradual Migration Path

1. **Phase 1** (Current): Keep 'unsafe-inline' but add all required domains ✅
2. **Phase 2**: Implement nonces for new inline scripts
3. **Phase 3**: Convert existing inline scripts to use nonces
4. **Phase 4**: Remove 'unsafe-inline' from script-src
5. **Phase 5**: Remove 'unsafe-eval' if possible
6. **Phase 6**: Implement 'strict-dynamic' for better security

## Additional Security Headers to Consider

```toml
# In netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    X-Permitted-Cross-Domain-Policies = "none"
    Expect-CT = "max-age=86400, enforce"
```

## Resources

- [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Mozilla CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Astro Security Best Practices](https://docs.astro.build/en/guides/security/)