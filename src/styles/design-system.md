# Jupitair HVAC Design System

## Core Principles
1. **Consistency**: Every element follows the same rules
2. **Accessibility**: WCAG AAA color contrast ratios
3. **Mobile-First**: Design for mobile, enhance for desktop
4. **Performance**: Minimal, semantic HTML with utility classes

## Layout System

### Container Strategy
- **Full-Width Sections**: Background colors/images extend edge-to-edge
- **Content Container**: Max-width container for readable content
- **Consistent Padding**: Mobile: px-4, Tablet: px-6, Desktop: px-8

```html
<!-- Standard Section Pattern -->
<section class="w-full bg-[section-color]">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    <!-- Content here -->
  </div>
</section>
```

### Grid System
- Mobile: 1 column
- Tablet (sm): 2 columns where appropriate
- Desktop (lg): 3-4 columns for cards, 12-column grid for complex layouts

## Color System

### Brand Colors
```css
--primary-50: #EBF5FF   /* Lightest blue */
--primary-100: #D1E7FF
--primary-200: #A6CFFF
--primary-300: #6BADFF
--primary-400: #3B8BFF
--primary-500: #0066FF  /* Main brand blue */
--primary-600: #0052CC
--primary-700: #003D99
--primary-800: #002966
--primary-900: #001433

--secondary-50: #FFF9E6
--secondary-100: #FFF3CC
--secondary-200: #FFE799
--secondary-300: #FFDB66
--secondary-400: #FFCF33
--secondary-500: #FFC300  /* Accent yellow */
--secondary-600: #CC9C00
--secondary-700: #997500
--secondary-800: #664E00
--secondary-900: #332700

--emergency-50: #FFF5F5
--emergency-100: #FFE3E3
--emergency-200: #FFC9C9
--emergency-300: #FFA8A8
--emergency-400: #FF8787
--emergency-500: #FF6B6B  /* Emergency red */
--emergency-600: #FA5252
--emergency-700: #F03E3E
--emergency-800: #E03131
--emergency-900: #C92A2A
```

### Neutral Colors
```css
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
--gray-950: #030712
```

### Color Usage Rules
1. **Text on Light Backgrounds**: 
   - Body: gray-700 (AAA compliant)
   - Headings: gray-900
   - Muted: gray-600

2. **Text on Dark Backgrounds**:
   - Body: gray-100
   - Headings: white
   - Muted: gray-300

3. **Text on Brand Colors**:
   - On primary-500+: white
   - On primary-50-200: gray-900
   - On secondary-500: gray-900
   - On emergency-500+: white

## Typography System

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

### Type Scale (Mobile → Desktop)
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
```

### Responsive Typography Classes
```html
<!-- Heading 1 -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">

<!-- Heading 2 -->
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">

<!-- Heading 3 -->
<h3 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">

<!-- Body Text -->
<p class="text-base sm:text-lg text-gray-700 leading-relaxed">

<!-- Small Text -->
<p class="text-sm sm:text-base text-gray-600">
```

## Component Patterns

### Cards
```html
<!-- Standard Card -->
<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
  <!-- Content -->
</div>

<!-- Elevated Card -->
<div class="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8">
  <!-- Content -->
</div>
```

### Buttons
```html
<!-- Primary Button -->
<button class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">

<!-- Secondary Button -->
<button class="bg-secondary-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors">

<!-- Outline Button -->
<button class="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">

<!-- Emergency Button -->
<button class="bg-emergency-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emergency-700 transition-colors">
```

### Section Patterns

#### Hero Section
```html
<section class="w-full bg-gradient-to-br from-primary-600 to-primary-800">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
      <p class="text-lg sm:text-xl text-primary-100 mb-8">
      <!-- CTAs -->
    </div>
  </div>
</section>
```

#### Content Section
```html
<section class="w-full bg-white">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Cards -->
    </div>
  </div>
</section>
```

#### Alternating Section (Gray Background)
```html
<section class="w-full bg-gray-50">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
    <!-- Content -->
  </div>
</section>
```

## Spacing System

### Padding Scale
```css
p-2: 0.5rem   /* 8px */
p-3: 0.75rem  /* 12px */
p-4: 1rem     /* 16px */
p-6: 1.5rem   /* 24px */
p-8: 2rem     /* 32px */
p-12: 3rem    /* 48px */
p-16: 4rem    /* 64px */
p-20: 5rem    /* 80px */
```

### Section Padding Pattern
- Mobile: py-12 (48px)
- Tablet: py-16 (64px)
- Desktop: py-20 (80px)

### Container Padding Pattern
- Mobile: px-4 (16px)
- Tablet: px-6 (24px)
- Desktop: px-8 (32px)

## Shadow System
```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
shadow-md: 0 4px 6px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
shadow-2xl: 0 25px 50px rgba(0,0,0,0.12)
```

## Border Radius
```css
rounded: 0.25rem      /* 4px */
rounded-md: 0.375rem  /* 6px */
rounded-lg: 0.5rem    /* 8px */
rounded-xl: 0.75rem   /* 12px */
rounded-2xl: 1rem     /* 16px */
rounded-full: 9999px
```

## Z-Index Scale
```css
z-0: 0
z-10: 10   /* Dropdowns */
z-20: 20   /* Sticky elements */
z-30: 30   /* Fixed headers */
z-40: 40   /* Modals backdrop */
z-50: 50   /* Modals */
```

## Breakpoints
```css
sm: 640px   /* Tablet */
md: 768px   /* Small laptop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## Animation Guidelines
- Use `transition-all duration-200` for hover effects
- Use `transition-shadow duration-300` for card hovers
- Use `transition-transform duration-200` for scale effects
- Always include `hover:` states for interactive elements

## Accessibility Requirements
1. All text must meet WCAG AAA contrast ratios
2. Interactive elements minimum 44x44px touch target
3. Focus states must be visible
4. Alt text for all images
5. Semantic HTML structure

## Quality Checklist for Every Page
- [ ] Consistent container width and padding
- [ ] Proper color contrast (no white on white, no black on black)
- [ ] Responsive typography scaling
- [ ] Consistent spacing between sections
- [ ] Hover states for all interactive elements
- [ ] Mobile-first responsive design
- [ ] No horizontal scroll on mobile
- [ ] Consistent button styles
- [ ] Consistent card styles
- [ ] Proper heading hierarchy