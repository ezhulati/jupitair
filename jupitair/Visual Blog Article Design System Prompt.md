Visual Blog Article Design System Prompt
## For Modern, Multi-Device, AI-Optimized Articles (2025)

### 🎨 Master Visual Design Prompt

```
You are an expert UI/UX designer specializing in blog article layouts that maximize readability, SEO performance, and AI parseability across all devices and screen sizes.

Design a comprehensive visual system for a blog article about [TOPIC] that follows these specifications:

## 1. RESPONSIVE LAYOUT ARCHITECTURE

### Mobile-First Grid (320px - 768px)
CONTAINER:
- Width: 100% with 20px padding
- Max-width: 100vw
- Font-size base: 16px (1rem)

TYPOGRAPHY SCALE:
- H1: clamp(28px, 7vw, 48px) - Line height: 1.2
- H2: clamp(24px, 5vw, 36px) - Line height: 1.3  
- H3: clamp(20px, 4vw, 28px) - Line height: 1.4
- Body: 16px-18px - Line height: 1.7-1.8
- Caption: 14px - Line height: 1.5

SPACING SYSTEM:
- Paragraph gap: 1.5rem
- Section gap: 3rem  
- Component gap: 2rem

### Tablet Enhancement (768px - 1024px)
CONTAINER:
- Max-width: 720px
- Centered with auto margins
- Padding: 40px

LAYOUT SHIFTS:
- Side-by-side image/text layouts activate
- Pull quotes extend beyond text column
- Navigation becomes sticky sidebar

### Desktop Optimization (1024px+)
CONTAINER:
- Article max-width: 680px (optimal reading)
- Full container: 1200px
- Three-column layout:
  - Left: TOC/Navigation (200px)
  - Center: Content (680px)
  - Right: Annotations/Related (200px)

## 2. VISUAL HIERARCHY COMPONENTS

### Hero Section
STRUCTURE:
[HERO-VISUAL]
- Height: 60vh mobile / 70vh desktop
- Image: Lazy-loaded, WebP with JPEG fallback
- Overlay: Gradient (rgba(0,0,0,0.3) to transparent)
- Text placement: Bottom-left with 40px padding

ELEMENTS:
- Category badge: Pill shape, accent color
- Title: White text with subtle shadow
- Meta info: Author, date, read time
- Progress indicator: Thin line showing scroll progress

### Article Body Components

[TEXT-BLOCK]
- Max-width: 65ch for optimal reading
- Font: System font stack with serif fallback
- Color: #1a1a1a on #ffffff (AAA contrast)
- Selection color: Brand accent at 20% opacity

[PULL-QUOTE]
- Border-left: 4px solid accent
- Padding-left: 24px
- Font-size: 1.25em
- Background: Subtle gray (#f8f9fa)
- Margin: 2rem 0
- Transform: translateX(-20px) on desktop

[CODE-BLOCK]
- Background: #1e1e1e
- Color: #d4d4d4
- Padding: 1.5rem
- Border-radius: 8px
- Overflow-x: auto
- Line numbers: Optional left gutter
- Syntax highlighting: Prism.js compatible

[IMAGE-COMPONENT]
CONTAINER:
- Width: 100vw (mobile) / 120% (desktop)
- Margin: 2rem -20px (mobile) / 2rem -10% (desktop)
- Border-radius: 0 (mobile) / 12px (desktop)

IMAGE:
- Aspect ratio: 16:9 for hero, varied for body
- Loading: lazy with blur-up placeholder
- Format: <picture> with WebP/AVIF/JPEG stack

CAPTION:
- Font-size: 0.875rem
- Color: #666
- Margin-top: 0.75rem
- Text-align: center

[INTERACTIVE-ELEMENT]
- Border: 2px dashed #e0e0e0
- Background: #f5f5f5
- Padding: 2rem
- Icon: Top-right corner
- Label: "Interactive content"
- Fallback: Static image for no-JS

### In-Article Navigation

[TABLE-OF-CONTENTS]
MOBILE:
- Collapsed by default
- Sticky bottom bar
- Expands upward on tap

DESKTOP:
- Fixed left sidebar
- Current section highlighted
- Smooth scroll on click
- Progress indicators per section

[READING-PROGRESS]
- Top bar: 3px height
- Color: Accent gradient
- Z-index: 1000
- Updates on scroll

## 3. MICRO-INTERACTIONS & ANIMATIONS

### Scroll Triggers
FADE-IN:
- Elements fade in as they enter viewport
- Intersection Observer API
- Stagger: 0.1s between elements
- Duration: 0.6s ease-out

PARALLAX:
- Hero image: 0.5 speed
- Pull quotes: 0.8 speed
- Background patterns: 0.3 speed

### Interactive States
LINKS:
- Default: Underline with 0.3 opacity
- Hover: Full opacity + color shift
- Transition: 0.2s ease

BUTTONS:
- Shadow: 0 → 4px on hover
- Transform: translateY(-2px)
- Active: scale(0.98)

### Reading Enhancements
TEXT-SELECTION:
- Custom selection color
- Share tooltip appears on selection
- Copy format options

HIGHLIGHTING:
- User can highlight text
- Saves to localStorage
- Shareable highlight links

## 4. AI & SEO VISUAL OPTIMIZATIONS

### Structured Data Visualization
[SCHEMA-MARKERS]
- Hidden visual markers for AI parsing
- Semantic HTML5 elements
- Microdata attributes
- JSON-LD script blocks

### Search Feature Optimization
[FEATURED-SNIPPET-BOX]
- First 40-60 words in larger font
- Background: Light accent color
- Border: 1px solid accent
- Padding: 1.5rem
- schema.org markup

[FAQ-SECTION]
- Accordion style
- Click to expand
- FAQPage schema
- Smooth height animations

### AI Reading Patterns
[SCANNABLE-STRUCTURE]
- Clear heading hierarchy
- Numbered lists for processes
- Bullet points for features
- Tables for comparisons
- Definition lists for terms

## 5. PERFORMANCE VISUAL FEATURES

### Loading States
SKELETON:
- Gray animated placeholders
- Matches final content layout
- Shimmer effect
- Progressive enhancement

### Image Optimization
RESPONSIVE IMAGES:
- srcset with 5 breakpoints
- sizes attribute properly set
- Art direction via <picture>
- WebP with fallbacks
- Blur-up placeholders (LQIP)

### Font Loading
STRATEGY:
- font-display: swap
- Preload critical fonts
- Fallback font metrics matching
- Subset for performance

## 6. ACCESSIBILITY VISUAL FEATURES

### Color & Contrast
REQUIREMENTS:
- WCAG AAA for body text
- AA for large text
- Focus indicators: 3px outline
- Color-blind safe palette
- Dark mode toggle

### Motion & Animation
RESPECT PREFERENCES:
- prefers-reduced-motion
- Pause animations option
- Skip to content link
- Keyboard navigation indicators

### Screen Reader Optimization
ARIA LANDMARKS:
- role="main" for article
- aria-label for sections
- Skip links visible on focus
- Heading hierarchy maintained

## 7. ENGAGEMENT VISUAL ELEMENTS

### Social Proof
[ENGAGEMENT-BAR]
MOBILE: Bottom fixed bar
- Views counter
- Share button
- Save button
- Comments count

DESKTOP: Floating left sidebar
- All mobile features
- Real-time updates
- Reaction buttons
- Read percentage

### Author Bio
[AUTHOR-CARD]
- Avatar: 60px circle
- Name and credentials
- Social links
- Follow button
- Slide-in on scroll

### Related Content
[RELATED-ARTICLES]
- Card grid layout
- 3 columns desktop / 1 mobile
- Thumbnail aspect: 16:9
- Hover: Slight lift + shadow
- Loading: Skeleton cards

## 8. SPECIAL CONTENT BLOCKS

### Data Visualizations
[CHART-CONTAINER]
- Responsive SVG
- Mobile: Stack vertically
- Desktop: Side-by-side
- Interactive tooltips
- Accessible data tables

### Call-to-Action Blocks
[CTA-BLOCK]
- Background: Gradient
- Padding: 3rem
- Border-radius: 16px
- Shadow: 0 10px 30px rgba(0,0,0,0.1)
- Button: High contrast

### Newsletter Signup
[NEWSLETTER-INLINE]
- Appears after 50% scroll
- Non-intrusive slide-in
- Dismissible
- Remembers preference
- A/B test variations

## OUTPUT DELIVERABLES:
1. **Mobile wireframe** (320px)
2. **Tablet wireframe** (768px)  
3. **Desktop wireframe** (1440px)
4. **Component library** (All states)
5. **Animation timeline** (Load sequence)
6. **Color & spacing tokens**
7. **Performance budget**
8. **Accessibility checklist**

## VISUAL STYLE PARAMETERS:
- Design trend: [Neomorphic / Glassmorphic / Minimalist / Bold]
- Color scheme: [Monochrome / Vibrant / Pastel / Dark]
- Typography: [Serif / Sans-serif / Mixed]
- Imagery style: [Photography / Illustration / Abstract / Data viz]
- Density: [Spacious / Balanced / Compact]

Now design the visual system for an article about [SPECIFIC TOPIC], ensuring it performs excellently across all devices while being loved by users, Google, and AI systems.
```

---

## 🎯 Quick Visual Templates

### Tech/Developer Articles
```css
/* Add to base design */
--code-bg: #1e1e1e;
--code-accent: #569cd6;
--terminal-green: #4ec9b0;
--syntax-comment: #6a9955;

Features:
- Wider code blocks (extend beyond text)
- Terminal-style command blocks
- GitHub-style markdown rendering
- Copy button on all code blocks
- Language labels
```

### Long-Form Journalism
```css
/* Add to base design */
--drop-cap-size: 4rem;
--pull-quote-font: 'Playfair Display';
--image-caption-style: italic;

Features:
- Large drop caps
- Full-bleed images
- Parallax storytelling
- Chapter navigation
- Reading time per section
```

### Data-Driven Articles
```css
/* Add to base design */
--chart-height: 400px;
--table-stripe: #f8f9fa;
--data-accent: #0066cc;

Features:
- Interactive charts
- Sortable tables
- Data export buttons
- Calculation tools
- Live data connections
```

---

## 📱 Device-Specific Optimizations

### Mobile (320-480px)
```
CRITICAL FEATURES:
- Thumb-friendly tap targets (44px min)
- Bottom navigation bar
- Swipe between sections
- Collapsible long content
- One-column everything
- Font size minimum: 16px
```

### Tablet (768-1024px)
```
ENHANCED FEATURES:
- Two-column layouts available
- Side-mounted TOC
- Hover states active
- Floating action buttons
- Grid layouts for galleries
- Optimal line length (65-75ch)
```

### Desktop (1440px+)
```
FULL FEATURES:
- Three-zone layout
- Sticky elements
- Advanced animations
- Multi-column text option
- Picture-in-picture videos
- Annotation layer
```

### Ultra-Wide (2560px+)
```
LUXURY FEATURES:
- Maximum 1200px centered
- Side margins for notes
- Dual article view
- Enhanced white space
- Cinema mode for media
```

---

## 🚀 Performance Visual Targets

### Core Web Vitals
```
LCP (Largest Contentful Paint):
- Hero image: <2.5s
- Optimize with srcset
- Preload critical images

CLS (Cumulative Layout Shift):
- Reserve space for images
- Set explicit dimensions
- Font-display: swap

FID (First Input Delay):
- Lazy load below fold
- Defer non-critical JS
- Progressive enhancement
```

### Loading Sequence
```
1. Critical CSS (inline)
2. Fonts (preload)
3. Above-fold content
4. JavaScript (deferred)
5. Below-fold images
6. Interactive elements
7. Analytics/tracking
```

---

## ✨ Modern Visual Trends 2025

### Glass Morphism Elements
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

### Variable Fonts
```css
.article-text {
  font-variation-settings: 
    'wght' var(--font-weight),
    'wdth' var(--font-width),
    'opsz' var(--font-optical-size);
}
```

### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  --bg: #1a1a1a;
  --text: #e8e8e8;
  --accent: #6366f1;
}
```

### Scroll Animations
```css
.fade-in {
  animation: fadeInUp 0.6s ease-out;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

---

## 🎨 Component Visual Library

### 1. Text Components
- Paragraph blocks
- Headings (H1-H6)
- Lists (ordered/unordered)
- Blockquotes
- Pull quotes
- Definitions
- Captions

### 2. Media Components  
- Hero images
- Inline images
- Galleries
- Videos
- Audio players
- Slideshows
- Before/after

### 3. Data Components
- Tables
- Charts
- Infographics
- Timelines
- Comparisons
- Statistics
- Progress bars

### 4. Interactive Components
- Accordions
- Tabs
- Tooltips
- Modals
- Calculators
- Quizzes
- Forms

### 5. Navigation Components
- TOC
- Breadcrumbs
- Previous/Next
- Related articles
- Tag clouds
- Search
- Filters

### 6. Social Components
- Share buttons
- Comments
- Reactions
- Author bio
- Subscribe
- Follow
- Save