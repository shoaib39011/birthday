# Birthday Wish Interactive Experience

## Overview

This is a full-screen, immersive birthday celebration web application designed to create a delightful, emotional experience for recipients. The application presents a multi-stage interactive journey featuring welcome screens, animated balloons, confetti effects, and personalized birthday messages. Built as a single-purpose celebration experience, it prioritizes joy, surprise, and visual delight over utility.

The application follows a stage-based progression model where users click through different celebration phases, culminating in a personalized birthday message that can be customized and persisted.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks (useState, useEffect) for local component state
- **Data Fetching**: TanStack React Query for server state management and caching

**UI Component System**: shadcn/ui (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Custom color scheme based on pink/magenta tones (330° hue) for celebratory feel

**Typography Strategy**:
- Google Fonts integration: Pacifico/Dancing Script for playful headers, Poppins for bold statements, Quicksand for readable messages
- Responsive type scale from base to 9xl for dramatic visual hierarchy
- Custom spacing system using Tailwind's 4px base unit

**Animation & Interaction Design**:
- Full viewport stages (100vh/100vw) for immersive experience
- Prefers-reduced-motion detection for accessibility
- Stage-based progression: welcome → balloons → message
- Particle effects using positioned elements with CSS transforms
- Multiple balloon colors mapped to theme variables (primary, secondary, accent, chart colors)

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- ES modules throughout the codebase
- Custom logging middleware for API requests
- Raw body parsing for potential webhook integrations

**API Design**:
- RESTful endpoints under `/api` prefix
- GET `/api/message` - Retrieves current birthday message
- POST `/api/message` - Updates birthday message with validation

**Data Validation**: Zod schemas
- `birthdayMessageSchema`: Validates message (1-1000 characters) and optional recipient name
- Type-safe validation with `drizzle-zod` integration for database operations

**Storage Strategy**:
- Interface-based design (`IStorage`) for storage abstraction
- Current implementation: `MemStorage` (in-memory storage)
- Designed for easy swap to database-backed storage
- Default message pre-populated in storage initialization

**Development Environment**:
- Vite middleware integration for hot module replacement
- Custom error overlay for runtime errors
- Replit-specific plugins for cartographer and dev banner
- Separate development and production build processes

### Data Storage Solutions

**Current Implementation**: In-memory storage (`MemStorage` class)
- Volatile storage that resets on server restart
- Single birthday message object stored in memory
- Suitable for development and single-user scenarios

**Database Configuration**: Drizzle ORM with PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Migration directory: `./migrations`
- Environment variable: `DATABASE_URL` (currently optional with in-memory fallback)
- Ready for production database integration without code changes

**Data Model**:
```typescript
{
  message: string (1-1000 chars, required)
  recipientName: string (optional)
}
```

### External Dependencies

**UI Component Libraries**:
- @radix-ui/* family (v1.x) - Accessible component primitives for dialogs, popovers, tooltips, form controls, etc.
- embla-carousel-react - Carousel functionality
- cmdk - Command palette component
- lucide-react - Icon library
- vaul - Drawer component

**Styling & Utilities**:
- tailwindcss - Utility-first CSS framework
- class-variance-authority - Component variant management
- clsx + tailwind-merge - Class name manipulation
- postcss + autoprefixer - CSS processing

**Forms & Validation**:
- react-hook-form - Form state management
- @hookform/resolvers - Validation resolver adapters
- zod - Schema validation library

**Database & Data**:
- @neondatabase/serverless - Neon PostgreSQL driver
- drizzle-orm - Type-safe ORM
- drizzle-kit - Database migration toolkit
- connect-pg-simple - PostgreSQL session store for Express

**Development Tools**:
- tsx - TypeScript execution engine
- esbuild - JavaScript bundler for production server
- @replit/vite-plugin-* - Replit-specific development enhancements
- @jridgewell/trace-mapping - Source map utilities

**Date/Time Utilities**:
- date-fns - Modern date utility library

**API & State Management**:
- @tanstack/react-query - Server state management and caching
- Default configuration: no refetching, infinite stale time for birthday message data

**Font Loading**:
- Google Fonts CDN for Pacifico, Poppins, and Quicksand font families
- Preconnect hints for performance optimization