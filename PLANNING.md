# PLANNING.md

## Project Overview

**BoltSnug** is a comprehensive multi-tenant business management platform built with React/TypeScript and Vite. The application provides role-based access control with specialized dashboards for different user types, integrating with Zoho Catalyst for backend services and Zoho API suite for CRM, bookings, analytics, and document signing capabilities.

## Architecture & Tech Stack

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2 (fast dev server, optimized builds)
- **Styling**: Tailwind CSS 3.4.1 with PostCSS
- **Icons**: Lucide React (modern, lightweight icon library)
- **Type Safety**: Full TypeScript implementation with strict type checking

### Backend Integration
- **Primary Backend**: Zoho Catalyst (serverless platform)
- **API Integration**: Zoho API Suite (CRM, Books, Campaigns, Bookings, Analytics, Sign)
- **Authentication**: Catalyst Auth with multi-role support
- **Data Flow**: RESTful APIs with OAuth2 token management

### Development Environment
- **Package Manager**: npm with lock file for consistent deps
- **Code Quality**: ESLint with modern React plugins
- **Port Configuration**: Development on port 5173 (Vite default)
- **Environment**: Configurable via environment variables

## User Roles & Access Control

### Role Hierarchy
1. **Admin**: Full system access, user management, analytics, system configuration
2. **Employee**: Internal operations, client management, reporting
3. **Contractor**: Service delivery, client interaction, project management
4. **Client**: Self-service portal, booking, communication, document access

### Authentication Flow
- Email/password authentication via Zoho Catalyst
- JWT token management with automatic refresh
- Role-based component rendering
- Secure session management with loading states

## Core Features & Components

### Dashboard System
- **Role-specific dashboards** with tailored UI/UX
- **Responsive design** with mobile-first approach
- **Real-time metrics** and KPI visualization
- **Activity tracking** and audit logs

### Integration Capabilities
- **Zoho CRM**: Customer relationship management, lead tracking
- **Zoho Books**: Financial management, invoicing
- **Zoho Campaigns**: Marketing automation
- **Zoho Bookings**: Appointment scheduling
- **Zoho Analytics**: Business intelligence, reporting
- **Zoho Sign**: Digital document signing

### UI/UX Design System
- **Design Tokens**: Custom CSS variables for colors, fonts, spacing
- **Component Library**: Reusable components with consistent styling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Animation**: Subtle transitions for enhanced user experience

## File Structure & Organization

### Source Code Organization
```
src/
├── components/           # Reusable UI components
│   ├── dashboards/      # Role-specific dashboard components
│   └── *.tsx           # Core layout components (Header, Sidebar, etc.)
├── hooks/              # Custom React hooks (useAuth, etc.)
├── lib/                # Third-party service integrations
├── types/              # TypeScript type definitions
├── utils/              # Helper functions and utilities
└── *.tsx/.ts          # Root app files and global styles
```

### Configuration Files
- **Vite**: Modern build tool configuration with React plugin
- **TypeScript**: Strict type checking with app-specific and Node configs
- **Tailwind**: Utility-first CSS with custom extensions
- **ESLint**: Modern React linting with TypeScript support

## Environment Configuration

### Required Environment Variables
```bash
# Zoho Catalyst Configuration (Vite)
VITE_CATALYST_PROJECT_ID=    # Catalyst project identifier
VITE_ENVIRONMENT=            # development/production
VITE_CATALYST_APP_URL=       # Catalyst app endpoint (used to load /__catalyst/sdk/init.js)

# Zoho API Configuration
ZOHO_CLIENT_ID=              # OAuth2 client ID
ZOHO_CLIENT_SECRET=          # OAuth2 client secret
ZOHO_REFRESH_TOKEN=          # Long-lived refresh token

# Zoho Service URLs (optional - defaults provided)
ZOHO_CRM_API_URL=            # CRM API endpoint
ZOHO_BOOKS_API_URL=          # Books API endpoint
ZOHO_CAMPAIGNS_API_URL=      # Campaigns API endpoint
ZOHO_BOOKINGS_API_URL=       # Bookings API endpoint
ZOHO_ANALYTICS_API_URL=      # Analytics API endpoint
ZOHO_SIGN_API_URL=           # Sign API endpoint
```

## Development Workflow

### Local Development
- **Development Server**: `npm run dev` (Vite dev server with HMR)
- **Production Build**: `npm run build` (optimized build with tree shaking)
- **Production Preview**: `npm run preview` (test production build locally)
- **Code Quality**: `npm run lint` (ESLint with auto-fix where possible)

### Deployment Strategy
- **Production Build**: Environment-specific builds with `NODE_ENV=production`
- **Port Configuration**: Flexible port assignment (default: Vite's 5173)
- **Asset Optimization**: Vite's built-in optimization for production
- **Environment Management**: Secure handling of API keys and secrets

## Security Considerations

### Authentication Security
- **OAuth2 Flow**: Secure token-based authentication
- **Token Management**: Automatic refresh with secure storage
- **Embedded Auth Init**: Load `__catalyst/sdk/init.js` from `VITE_CATALYST_APP_URL`; with SDK v4, use `window.catalyst.auth` when available (no `initialize()` call).
- **Role Validation**: Server-side role verification
- **Session Timeout**: Configurable session expiration

### API Security
- **Environment Variables**: Sensitive data in env vars, not code
- **CORS Configuration**: Proper cross-origin request handling
- **Error Handling**: Secure error messages without data leakage
- **Input Validation**: Client and server-side validation

## Performance Optimization

### Bundle Optimization
- **Code Splitting**: Dynamic imports for role-specific dashboards
- **Tree Shaking**: Dead code elimination via Vite
- **Asset Optimization**: Image and CSS optimization
- **Lazy Loading**: Component-level lazy loading where appropriate

### Runtime Performance
- **React Best Practices**: Memoization, proper key props, effect optimization
- **API Caching**: Token caching and request deduplication
- **Loading States**: User-friendly loading indicators
- **Error Boundaries**: Graceful error handling

## Scalability & Maintenance

### Code Organization
- **Modular Architecture**: Clear separation of concerns
- **Type Safety**: Comprehensive TypeScript coverage
- **Reusable Components**: DRY principles with component composition
- **Service Layer**: Abstracted API integrations

### Future Considerations
- **Testing Strategy**: Unit tests, integration tests, E2E tests
- **State Management**: Consider Redux/Zustand for complex state
- **PWA Features**: Service workers, offline capabilities
- **Monitoring**: Error tracking, performance monitoring

## Constraints & Limitations

### Technical Constraints
- **Zoho Catalyst Dependency**: Tight coupling with Zoho ecosystem
- **Browser Support**: Modern browsers only (ES6+ features)
- **API Rate Limits**: Zoho API quotas and rate limiting
- **Environment Variables**: Secure handling required for production

### Business Constraints
- **Multi-tenancy**: Role-based access control requirements
- **Compliance**: Data privacy and security regulations
- **Integration Limits**: Dependent on Zoho API capabilities
- **Scalability**: Catalyst platform scaling considerations

## Success Metrics

### Technical Metrics
- **Bundle Size**: Keep under 1MB for initial load
- **Load Time**: First Contentful Paint under 2 seconds
- **Error Rate**: Less than 1% runtime errors
- **Test Coverage**: Aim for 80%+ code coverage

### Business Metrics
- **User Adoption**: Role-specific dashboard usage
- **Integration Success**: API call success rates
- **Performance**: User session duration and engagement
- **Security**: Zero security incidents or data breaches

# SNUGS & KISSES - PHASE 2 ENHANCEMENT

## UI/UX Refinements

### Shadcn UI Components
**Zia Assistant Integration:**
- Floating chat bubble with glassmorphism effects
- Voice capability toggle
- Sentiment analysis display
- Real-time insights cards

**Premium Card System:**
```css
.premium-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(215, 199, 237, 0.2);
  box-shadow: 0 12px 40px rgba(59, 35, 82, 0.08);
  border-radius: 16px;
  transition: all 0.3s ease;
}
.premium-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(59, 35, 82, 0.12);
}
```

### Advanced Visual Effects
**Zia Chat Bubble:**
```css
.zia-chat-bubble {
  background: linear-gradient(135deg, 
    rgba(59, 35, 82, 0.9) 0%, 
    rgba(215, 199, 237, 0.8) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(215, 199, 237, 0.3);
  box-shadow: 0 8px 32px rgba(59, 35, 82, 0.2);
  border-radius: 24px;
  position: fixed;
  bottom: 24px;
  right: 24px;
}
```

## Enhanced Functionality

### Video Call System
- WebRTC integration with screen sharing
- Recording capabilities for compliance
- Multi-participant support
- Bandwidth optimization

### Digital Contract System
- Legal timestamp logging with IP tracking
- Multi-signature support
- PDF generation with embedded signatures
- Blockchain verification option

### Hour Tracking Enhancement
- GPS location verification
- Photo check-in/check-out
- Automatic break detection
- Real-time billing calculation

### Document Processing
- Zia OCR with 99% accuracy
- Automatic document categorization
- Expiration date extraction and alerts
- Compliance verification workflows

## Security & Compliance

### HIPAA Enhancement
- End-to-end encryption for all communications
- Audit logging with immutable records
- Data retention policy automation
- Breach detection and notification

### Session Management
- Multi-factor authentication
- Biometric login support
- Session timeout controls
- Device fingerprinting

## Performance Optimization

### Mobile Enhancement
- Progressive Web App capabilities
- Offline functionality for critical features
- Push notifications
- Touch-optimized interfaces

### Analytics Integration
- Real-time dashboard metrics
- User behavior tracking
- Performance monitoring
- Predictive analytics with Zia

## Additional Integrations

### Third-Party Services
- Background check API integration
- Payment processing (Stripe/Square)
- SMS notifications (Twilio)
- Email marketing automation

### Zia AI Advanced Features
- Predictive caregiver matching
- Sentiment analysis on feedback
- Automated scheduling optimization
- Risk assessment algorithms