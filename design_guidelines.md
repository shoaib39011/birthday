# Birthday Wish Interactive Experience - Design Guidelines

## Design Approach

**Reference-Based: Interactive Celebration Experiences**

Draw inspiration from:
- Apple's celebratory animations (product launches, achievements)
- Interactive greeting card platforms (Moonpig, Paperless Post)
- Playful web experiences like Bruno Simon's portfolio
- iOS/Android celebration animations (confetti, particle effects)

This is a single-purpose emotional experience prioritizing delight, surprise, and joy over utility.

## Typography System

**Font Selection:** Use Google Fonts
- Display/Celebration: "Pacifico" or "Dancing Script" for playful, handwritten feel
- Accent: "Poppins" (Bold/SemiBold) for "HAPPY BIRTHDAY" impact
- Message: "Quicksand" (Regular/Medium) for custom message readability

**Type Scale:**
- Welcome "HI": 6xl to 8xl (96-128px equivalent)
- Heart symbol: 5xl to 6xl
- "HAPPY BIRTHDAY": 7xl to 9xl with letter spacing
- Custom message: 2xl to 3xl with comfortable line height (1.6)
- Interactive prompts: sm to base

## Layout System

**Viewport Strategy:**
Each stage fills 100vh/100vw - this is a full-screen immersive experience

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16
- Stage padding: p-8 to p-16
- Message spacing: space-y-8 to space-y-12
- Element gaps: gap-6 to gap-8

**Layout Structure:**
- All stages: Centered flex containers (items-center justify-center)
- Balloon layer: Absolute positioning from bottom
- Gifts/chocolates: Fixed positioning for floating animations
- Custom message: Max-width prose container for readability

## Component Library

### Stage 1: Welcome Screen
- Large "HI" text centered
- Animated heart symbol (beating/pulsing)
- Subtle click prompt at bottom ("Click anywhere to continue")
- Gradient background with soft radial blur

### Stage 2: Balloon Reveal
- 12-15 balloons of varying sizes
- Start position: translateY(120vh) bottom of screen
- String attachments (thin lines from balloon base)
- "HAPPY BIRTHDAY" revealed as balloons rise past center
- Balloons continue floating upward and fade out
- Letter reveal timing: Staggered 100ms per letter

### Stage 3: Custom Message & Celebration
- Centered message card with soft shadow/blur backdrop
- Floating gift boxes (5-7 elements)
- Chocolate/candy elements (6-8 elements)
- Confetti particles (20-30 pieces)
- Subtle background shimmer/sparkle effect

### Interactive Elements
- Cursor changes to pointer on clickable areas
- Smooth fade transitions between stages (400-600ms)
- Scale-up animations on click (scale from 0.95 to 1)

## Animation Specifications

**Timing Functions:**
- Balloon rise: cubic-bezier(0.25, 0.46, 0.45, 0.94) - smooth upward
- Gift float: cubic-bezier(0.42, 0, 0.58, 1) - gentle bobbing
- Transitions: ease-in-out

**Animation Durations:**
- Stage transitions: 600ms
- Balloon rise: 3-4s
- Gift/chocolate float: 2-3s loops
- Heart pulse: 1.5s infinite
- Confetti fall: 3-5s staggered

**Animation Patterns:**
- Balloons: Individual timing offsets (100-300ms between each)
- Gifts: Random rotation wobble (-5deg to 5deg)
- Chocolates: Bounce keyframes (translateY oscillation)
- Confetti: Spiral fall with rotation

## Interactive States

**Click Interactions:**
- Stage 1 → Stage 2: Entire screen is clickable
- Stage 2 → Stage 3: Click after balloons pass 50vh
- No back navigation - linear progression only
- Visual feedback on click: Ripple effect from click point

## Accessibility Considerations

- Reduced motion support: Disable complex animations if prefers-reduced-motion
- Keyboard accessibility: Space/Enter triggers progression
- Focus indicators: Visible outline on interactive areas
- Semantic HTML: Proper heading hierarchy for screen readers
- Alternative text for decorative elements

## Performance Notes

- Use CSS transforms (translate, scale, rotate) for animations - GPU accelerated
- Limit simultaneous animations to prevent jank
- Lazy-load celebration assets until Stage 3
- Use will-change sparingly for critical animations only

## Visual Hierarchy

1. Primary focus: Animated elements (balloons, gifts)
2. Secondary: Text messages (HI, HAPPY BIRTHDAY, custom message)
3. Tertiary: Interaction prompts and background effects

**Contrast:** Ensure text remains readable against animated backgrounds - use backdrop blur/shadow on message containers

---

**Implementation Priority:** Focus animation quality over quantity. Three polished stages beat five rushed ones. Each interaction should feel magical and intentional.