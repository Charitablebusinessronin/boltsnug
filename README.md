# Snugs & Kisses - Healthcare Authentication Portal

A secure, role-based authentication gateway for postpartum care services. This application provides specialized dashboards for clients, contractors, administrators, and employees in the healthcare industry.

## 🏥 Project Overview

**Snugs & Kisses** is a healthcare platform focused on postpartum care services. The application serves as a login portal that routes authenticated users to role-specific dashboards based on their access level and responsibilities.

### Key Features
- **Secure Authentication**: Zoho Catalyst-powered authentication system
- **Role-Based Access Control**: Four distinct user roles with specialized interfaces
- **Healthcare-Focused UI**: Custom design system optimized for healthcare workflows
- **Comprehensive Integration**: Full Zoho ecosystem integration (CRM, Books, Calendar, Learn, Zia)
- **HIPAA Compliance Ready**: Security-first approach for healthcare data handling

## 🎨 Brand Guidelines

### Colors
- **Primary**: `#3B2352` (Deep healthcare purple)
- **Accent**: `#D7C7ED` (Soft lavender)
- **Luxury**: `#D4AF37` (Premium gold)
- **Background**: `#F8F6FC` (Clean white with purple tint)

### Typography
- **Headings**: Merriweather (professional, readable)
- **Body Text**: Lato (clean, modern)
- **UI Elements**: Nunito Sans (friendly, accessible)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Zoho Catalyst account
- Zoho API credentials

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd boltsnug

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your Zoho Catalyst and API credentials

# Start development server
npm run dev
```

### Environment Variables
```bash
# Zoho Catalyst Configuration (Vite)
VITE_CATALYST_PROJECT_ID=your_project_id
VITE_ENVIRONMENT=development
VITE_CATALYST_APP_URL=your_catalyst_app_url   # used to load /__catalyst/sdk/init.js

# Zoho API Configuration
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token

# Optional: Custom Zoho Service URLs
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v6
ZOHO_BOOKS_API_URL=https://books.zoho.com/api/v3
ZOHO_CAMPAIGNS_API_URL=https://campaigns.zoho.com/api/v1.1
ZOHO_BOOKINGS_API_URL=https://bookings.zoho.com/api/v1
ZOHO_ANALYTICS_API_URL=https://analyticsapi.zoho.com/api
ZOHO_SIGN_API_URL=https://sign.zoho.com/api/v1
```

## 👥 User Roles & Dashboards

### 🔵 Client Portal (`/client-dashboard`)
Postpartum care clients and families
- Service request management
- Video call scheduling
- Care hours tracking
- Provider feedback system
- Contract management
- Caregiver matching

### 🟢 Contractor Portal (`/contractor-dashboard`) 
Healthcare providers and caregivers
- Available job listings
- Application tracking
- Document management
- Training modules
- Client messaging

### 🔴 Admin Portal (`/admin-dashboard`)
Platform administrators
- User management
- Analytics and reporting
- Workflow automation
- OCR document processing
- Compliance monitoring

### 🟡 Employee Portal (`/employee-dashboard`)
Internal staff members
- Staff scheduling
- Internal communications
- Training programs
- HR tools and resources

## 🔧 Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **State Management**: React hooks + Context API

### Backend Integration
- **Authentication**: Zoho Catalyst Auth (Embedded Auth via `__catalyst/sdk/init.js` and `window.catalyst.auth`)
- **APIs**: Zoho CRM, Books, Calendar, Learn, Zia
- **Functions**: 16 Zoho Catalyst serverless functions
- **Security**: OAuth2 with automatic token refresh

## 📊 Serverless Functions (Zoho Catalyst)

### Client Functions (8)
- `video-call`: Video consultation management
- `interview`: Interview scheduling
- `service-request`: Care service requests
- `info-sheet`: Client information collection
- `contracts`: Contract generation/management
- `hours`: Care hour tracking
- `feedback`: Provider feedback collection
- `caregiver-matching`: AI-powered caregiver matching

### Contractor Functions (3)
- `application`: Application processing
- `documents`: Document validation
- `orientation`: Onboarding process

### Admin Functions (1)
- `automation`: Workflow automation

### HR Functions (4)
- `employee-onboarding`: New employee setup
- `performance-tracking`: Performance monitoring
- `compliance-monitoring`: Regulatory compliance
- `recruitment-analytics`: Hiring analytics

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run build:production # Production build with optimizations
npm run preview          # Preview production build
npm run start            # Start production server (port 5000)

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically

# Deployment
npm run deploy           # Deploy to production
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboards/     # Role-specific dashboard components
│   ├── DashboardLayout.tsx
│   ├── Header.tsx
│   ├── LoginForm.tsx
│   └── Sidebar.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── lib/                # Third-party integrations
│   ├── catalyst.ts     # Zoho Catalyst service
│   ├── functions.ts    # Serverless function calls
│   └── zoho-api.ts     # Zoho API service
├── types/              # TypeScript type definitions
│   └── auth.ts
├── utils/              # Utility functions
│   └── menuItems.ts
├── App.tsx             # Main application component
├── index.css          # Global styles
├── main.tsx           # Application entry point
└── vite-env.d.ts      # Vite environment types
```

## 🔐 Security Considerations

- **HIPAA Compliance**: All healthcare data handling follows HIPAA requirements
- **Authentication Security**: OAuth2 with secure token management
- **Role-based Access**: Strict role validation on both client and server
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Audit Logging**: Comprehensive activity logging for compliance

## 🧪 Testing Strategy

```bash
# Unit Tests
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Integration Tests
npm run test:integration # Run integration tests

# E2E Tests
npm run test:e2e         # Run end-to-end tests
```

## 📈 Performance Optimization

- **Code Splitting**: Role-based dynamic imports
- **Lazy Loading**: Component-level lazy loading
- **Bundle Optimization**: Vite's tree shaking and optimization
- **API Caching**: Smart caching for Zoho API responses
- **Image Optimization**: Optimized healthcare imagery

## 🚀 Deployment

### Development Environment
```bash
npm run dev
```
Access at `http://localhost:5173`

### Production Deployment
```bash
npm run build:production
npm run start
```
Access at `http://localhost:5000`

### Environment-Specific Builds
- **Development**: Full error logging, source maps
- **Production**: Optimized builds, error tracking, performance monitoring

## 📋 Project Management

- **PLANNING.md**: Comprehensive project architecture and planning
- **TASK.md**: Current tasks, backlog, and milestone tracking
- **Issues**: Track bugs and feature requests
- **Milestones**: Major release planning and goals

## 🤝 Contributing

1. Review `PLANNING.md` for architecture guidelines
2. Check `TASK.md` for current priorities
3. Follow healthcare compliance requirements
4. Maintain comprehensive test coverage
5. Update documentation for any new features

## 📄 License

This project is proprietary software for Snugs & Kisses healthcare services.

## 📞 Support

For technical support or questions:
- Review project documentation in `PLANNING.md`
- Check current tasks in `TASK.md`
- Submit issues for bug reports or feature requests

---

**Built with ❤️ for postpartum care families**
