# Design System Rules - MUST FOLLOW

## 1. BUTTON ICONS - NO WRAPPING EVER
- **ALWAYS** use `flex-nowrap` on buttons with icons
- **ALWAYS** add `flex-shrink-0` to icon SVGs
- **NEVER** allow icons and text to wrap to different lines
- Use `whitespace-nowrap` on button text spans

### Correct Implementation:
```astro
<button class="inline-flex items-center gap-2 flex-nowrap">
  <svg class="w-5 h-5 flex-shrink-0">...</svg>
  <span class="whitespace-nowrap">Button Text</span>
</button>
```

## 2. BREADCRUMBS - ALWAYS VISIBLE
- **ALWAYS** use `overflow-x-auto` on breadcrumb nav
- **ALWAYS** use `whitespace-nowrap` on breadcrumb ol
- **NEVER** include the current page title in breadcrumbs (stop one level before)
- Keep breadcrumbs simple and scannable

### Correct Implementation:
```astro
<nav class="overflow-x-auto" aria-label="Breadcrumb">
  <ol class="flex items-center space-x-2 text-sm whitespace-nowrap">
    <!-- Stop before current page -->
  </ol>
</nav>
```

## 3. BLOG TYPOGRAPHY - MOBILE FIRST
- **ALWAYS** use responsive heading sizes with `sm:` prefixes
- **ALWAYS** maintain proper heading hierarchy (h1 > h2 > h3 > h4)
- **ENSURE** sufficient spacing between sections

### Heading Sizes:
- H1: `text-3xl sm:text-4xl` (30px/36px mobile, 36px/40px desktop)
- H2: `text-2xl sm:text-3xl` (24px/32px mobile, 30px/36px desktop)  
- H3: `text-xl sm:text-2xl` (20px/28px mobile, 24px/32px desktop)
- H4: `text-lg sm:text-xl` (18px/28px mobile, 20px/28px desktop)

### Spacing:
- Between major sections: `mt-16 mb-8`
- Between subsections: `mt-12 mb-6`
- Between paragraphs: `mb-6`

## 4. CTA SECTIONS - CLEAN DESIGN
- **ALWAYS** add proper padding below CTAs before other content
- **NEVER** let CTAs touch other sections
- Use `mb-8` minimum after CTA cards

## 5. MOBILE OPTIMIZATION
- **ALWAYS** test on 375px width (iPhone SE)
- **ENSURE** all interactive elements are minimum 44px tall
- **PREVENT** horizontal scroll at all costs

## 6. CONSISTENCY RULES
- **NEVER** use different button styles for same actions
- **ALWAYS** use the design tokens from `tokens.css`
- **MAINTAIN** consistent spacing using spacing system classes

## ENFORCEMENT
These rules are non-negotiable. Any component that violates these rules must be fixed immediately. Check these rules before every commit.

### Testing Checklist:
- [ ] Buttons with icons don't wrap on mobile
- [ ] Breadcrumbs visible on all screen sizes
- [ ] Blog headings scale properly from mobile to desktop
- [ ] CTAs have proper spacing
- [ ] No horizontal scroll on mobile
- [ ] All text is readable (proper contrast)