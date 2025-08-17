# Jupitair HVAC Design System

## Core Principles
- **Professional**: Every element must look polished and high-quality
- **Consistent**: Same patterns across all pages
- **Accessible**: WCAG AA compliant with proper contrast ratios
- **Responsive**: Mobile-first with proper scaling

## Spacing & Layout

### Container Specifications
```css
/* Standard page container */
.container {
  max-width: 1280px; /* max-w-7xl */
  padding: 0 1rem;   /* px-4 */
  margin: 0 auto;
}

/* Hero sections in colored backgrounds */
.hero-section {
  padding: 4rem 1.5rem; /* py-16 px-6 */
  @media (min-width: 640px) {
    padding: 4rem 2rem; /* sm:px-8 */
  }
  @media (min-width: 1024px) {
    padding: 4rem 3rem; /* lg:px-12 */
  }
}

/* Content within heroes */
.hero-content {
  max-width: 56rem; /* max-w-4xl */
  margin: 0 auto;
}
```

### Button Rules
1. **Never stretch edge-to-edge** on desktop
2. **Mobile**: Full width (w-full) below 640px
3. **Desktop**: Auto width with min/max constraints
4. **Hero buttons**: max-w-[280px] to prevent oversizing

```css
/* Button in hero/CTA sections */
.hero-button {
  width: 100%;           /* w-full */
  min-width: 200px;      /* min-w-[200px] */
  max-width: 280px;      /* max-w-[280px] */
  
  @media (min-width: 640px) {
    width: auto;         /* sm:w-auto */
  }
}
```

### Minimum Padding Requirements
- **Cards**: 1.5rem (p-6) minimum, 2rem (p-8) preferred
- **Sections**: 1rem (p-4) minimum on mobile, 2rem (p-8) on desktop  
- **Hero sections**: Never less than 1.5rem (px-6) horizontal padding
- **Buttons**: Never touch container edges

## Color System

### Primary Palette
- **Primary Blue**: #2563eb (blue-600)
- **Primary Dark**: #1e40af (blue-800)
- **Primary Light**: #3b82f6 (blue-500)

### Status Colors
- **Emergency/Urgent**: #dc2626 (red-600)
- **Success**: Use primary blue, NOT green (contrast issues)
- **Warning**: #eab308 (yellow-500)
- **Info**: Primary blue variants

### Text Colors
- **On white**: #111827 (gray-900) for headers, #4b5563 (gray-600) for body
- **On dark**: #ffffff (white) for headers, #e5e7eb (gray-300) for body
- **Never use**: gray-400 or lighter on white, green-600 on white

### Background Rules
- **Cards on dark sections**: Use solid colors (gray-800), NOT semi-transparent
- **Overlays**: Use white/20 for hover states on colored backgrounds
- **Gradients**: from-blue-600 to-blue-800 for primary sections
- **Emergency cards**: Use gradient with border for better definition
  - Background: `bg-gradient-to-br from-emergency-500 to-emergency-600`
  - Border: `border-2 border-emergency-400`
  - Icon background: Solid white, NOT semi-transparent
  - Icon color: Use contrasting color (emergency-600 on white)

## Typography

### Font Sizes
```css
/* Headings */
.h1 { font-size: 2.25rem; } /* text-4xl */
.h1-lg { font-size: 3.75rem; } /* md:text-6xl */

.h2 { font-size: 1.875rem; } /* text-3xl */
.h2-lg { font-size: 2.25rem; } /* md:text-4xl */

.h3 { font-size: 1.5rem; } /* text-2xl */
.body { font-size: 1.125rem; } /* text-lg */
```

## Component Patterns

### Hero Section Template
```astro
<section class="hero bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 sm:px-8 lg:px-12 mb-12 rounded-lg">
  <div class="text-center max-w-4xl mx-auto">
    <h1 class="text-4xl md:text-6xl font-bold mb-4">
      {title}
    </h1>
    <p class="text-xl md:text-2xl mb-8">
      {description}
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button variant="emergency" size="xl" class="w-full sm:w-auto min-w-[200px] max-w-[280px] justify-center">
        Primary CTA
      </Button>
      <Button variant="outline" size="xl" class="w-full sm:w-auto min-w-[200px] max-w-[280px] justify-center">
        Secondary CTA
      </Button>
    </div>
  </div>
</section>
```

### Emergency CTA Section Template
```astro
<section class="bg-red-600 text-white p-8 rounded-lg">
  <div class="text-center max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-4">{title}</h2>
    <p class="text-xl mb-6">{description}</p>
    <Button variant="secondary" size="xl" class="inline-flex justify-center min-w-[200px] max-w-[280px]">
      Call Now
    </Button>
  </div>
</section>
```

### Card on Dark Background
```astro
<Card variant="elevated" padding="lg" class="bg-gray-800 border-gray-700">
  <!-- Never use semi-transparent backgrounds like bg-white/10 -->
  <!-- Always use solid colors for proper contrast -->
</Card>
```

## Responsive Breakpoints
- **Mobile**: < 640px (default)
- **Tablet**: 640px - 1024px (sm:)
- **Desktop**: 1024px - 1280px (lg:)
- **Wide**: > 1280px (xl:)

## Quality Checklist
Before deploying any UI component:

### Visual Review
- [ ] Buttons don't touch container edges
- [ ] Proper padding on all sides (min 1.5rem)
- [ ] Text is readable (contrast ratio > 4.5:1)
- [ ] No stretched buttons on desktop
- [ ] Consistent spacing between elements

### Responsive Check
- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1440px (desktop)
- [ ] Test at 1920px (wide)

### Accessibility
- [ ] All text passes WCAG AA contrast
- [ ] Interactive elements have focus states
- [ ] Buttons have min-height of 44px
- [ ] Touch targets are at least 44x44px

## Common Mistakes to Avoid
1. ❌ Buttons stretching edge-to-edge in heroes
2. ❌ Using green text on white (poor contrast)
3. ❌ Semi-transparent backgrounds for cards
4. ❌ Insufficient padding in colored sections
5. ❌ Text colors that fail contrast checks
6. ❌ Inconsistent button sizing across pages

## Implementation Priority
1. Fix all hero sections with proper padding
2. Constrain all button widths with max-width
3. Replace green colors with primary blue
4. Add proper padding to all colored sections
5. Ensure consistent spacing throughout