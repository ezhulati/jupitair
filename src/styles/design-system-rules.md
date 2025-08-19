# JUPITAIR HVAC DESIGN SYSTEM - CONTRAST RULES

## 🚨 CRITICAL RULES - NEVER VIOLATE

### 1. WHITE BACKGROUNDS ONLY FOR CARDS WITH DARK TEXT
- **Required**: `bg-white` for all cards with dark text
- **Text colors**: `text-gray-800`, `text-gray-900` for readability
- **Never use**: `text-gray-600` or lighter on white backgrounds

### 2. DARK BACKGROUNDS ONLY FOR CARDS WITH WHITE TEXT
- **Required**: `bg-gray-800`, `bg-gray-900` for cards with white text
- **Text colors**: `text-white`, `text-gray-100` for readability
- **Never use**: `text-gray-800` or darker on dark backgrounds

### 3. COLORED BACKGROUNDS FOLLOW WCAG AA STANDARDS
- **Blue**: `bg-blue-600` or darker with `text-white`
- **Red**: `bg-red-600` or darker with `text-white`  
- **Green**: `bg-green-600` or darker with `text-white`
- **Minimum contrast ratio**: 4.5:1 for normal text

### 4. BANNED COMBINATIONS - AUTOMATIC FAILURE
- ❌ NO `bg-gray-50`, `bg-gray-100`, `bg-gray-200` with `text-gray-600` or lighter
- ❌ NO `bg-gray-400` or darker with `text-gray-800` or darker
- ❌ NO "glass" variants that create gray/transparent backgrounds
- ❌ NO cards where text color ≤ 4.5:1 contrast with background

### 5. COMPONENT-SPECIFIC RULES

#### PremiumCard
- ✅ **Allowed variants**: `"elevated"` (white bg), `"premium"` (dark bg) ONLY
- ❌ **BANNED**: `"glass"` variant (causes gray backgrounds)
- **Default**: Always use `variant="elevated"` unless specifically need dark theme

#### Card
- ✅ **Required**: Always `bg-white` with dark text
- ✅ **Text**: `text-gray-800` or `text-gray-900`
- ❌ **Never**: Gray backgrounds of any kind

#### Info Boxes/Stats
- ✅ **Use**: `bg-white border border-gray-200 shadow-sm`
- ✅ **Text**: `text-gray-700` for labels, `text-gray-900` for values
- ❌ **Never**: `bg-gray-50` or any gray backgrounds

## 🛠️ IMPLEMENTATION STANDARDS

### Color Palette - Contrast Safe
```css
/* Backgrounds */
--safe-bg-white: #ffffff
--safe-bg-dark: #1f2937
--safe-bg-primary: #1d4ed8 
--safe-bg-success: #059669
--safe-bg-warning: #d97706
--safe-bg-danger: #dc2626

/* Text colors for white backgrounds */
--safe-text-primary: #111827    /* gray-900 */
--safe-text-secondary: #374151  /* gray-700 */
--safe-text-muted: #6b7280      /* gray-500 - USE SPARINGLY */

/* Text colors for dark backgrounds */
--safe-text-white: #ffffff
--safe-text-light: #f9fafb      /* gray-50 */
```

### Pre-approved Combinations
```css
/* White cards - ALWAYS SAFE */
.white-card {
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
}

/* Dark cards - ALWAYS SAFE */  
.dark-card {
  background: #1f2937;
  color: #ffffff;
  border: 1px solid #374151;
}

/* Primary action cards - ALWAYS SAFE */
.primary-card {
  background: #1d4ed8;
  color: #ffffff;
}
```

## 🔍 TESTING REQUIREMENTS

### Automated Checks
1. **Contrast ratio**: All text must pass WCAG AA (4.5:1)
2. **Component scan**: No `variant="glass"` anywhere in codebase
3. **Color audit**: No banned color combinations
4. **Visual regression**: Screenshots must pass contrast review

### Manual Verification
1. **Mobile review**: Check all cards on small screens
2. **Accessibility tools**: Use axe DevTools for live testing
3. **Real device testing**: Verify on actual phones/tablets
4. **User testing**: Get feedback on readability

## 🚀 ENFORCEMENT

### Development Process
- [ ] Pre-commit hook: Scan for banned patterns
- [ ] PR reviews: Automated contrast checking
- [ ] Design reviews: Visual contrast approval required
- [ ] QA testing: Manual contrast verification

### Banned Patterns (Auto-Fail CI)
```regex
variant="glass"                    # No glass cards
bg-gray-[0-4]0.*text-gray-[5-9]   # Light bg + light text
bg-gray-[4-9].*text-gray-[7-9]    # Dark bg + dark text
text-gray-[4-6](?!.*bg-)          # Light text without background context
```

## 📚 EDUCATION

### For Developers
- Always check contrast ratios before committing
- Use browser DevTools contrast checker
- Test with actual users who have vision difficulties
- Default to white cards unless specifically need dark theme

### For Designers  
- Design in high contrast first, then adjust if needed
- Use contrast checking tools in design software
- Consider accessibility as core requirement, not afterthought
- Test designs on various devices and lighting conditions

## 🔄 CONTINUOUS IMPROVEMENT

This document will be updated as we discover new contrast issues. All violations should be documented and rules updated to prevent recurrence.

**Last Updated**: 2024-08-19
**Version**: 1.0.0  
**Status**: ACTIVE ENFORCEMENT

---

**Remember**: Good contrast isn't just about compliance - it makes the site usable for everyone and improves conversion rates. When in doubt, choose higher contrast.