# Snugs & Kisses Healthcare Platform

## Overview

Snugs & Kisses is a comprehensive healthcare platform designed to connect clients with postpartum care, lactation support, mental health services, and childcare providers. The platform serves four distinct user roles - clients seeking care, contractors providing services, employees managing operations, and administrators overseeing the entire system.

The application is built as a full-stack React application with Express backend, featuring role-based dashboards, real-time communication, document management, training modules, and integration with Zoho's business ecosystem including Catalyst serverless platform, CRM, Books, Calendar, and other Zoho services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom healthcare design system
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **State Management**: React hooks with Tanstack Query for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: REST endpoints with `/api` prefix
- **Middleware**: Express middleware for logging, JSON parsing, and error handling
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

### Authentication & Authorization
- **Primary**: Zoho Catalyst embedded authentication with role-based access control
- **Fallback**: Development mode authentication bypass for local testing
- **Session Management**: Catalyst-managed sessions with localStorage fallback
- **Roles**: Client, Contractor, Admin, Employee with distinct dashboard experiences

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Configured for PostgreSQL with Neon Database serverless
- **Schema**: Shared schema definition between client and server
- **Migrations**: Drizzle Kit for database migrations and schema management

### External Service Integrations
- **Zoho Catalyst**: Serverless functions, authentication, and data storage
- **Zoho CRM**: Lead and contact management with healthcare-specific fields
- **Zoho Books**: Time tracking, billing, and invoicing for care services
- **Zoho Calendar**: Appointment scheduling and availability management
- **Zoho Learn**: Training modules and certification tracking
- **Zoho Zia**: OCR processing, sentiment analysis, and AI-powered matching

### Role-Based Features
- **Client Dashboard**: Care matching, service requests, video calls, feedback system, contract management
- **Contractor Dashboard**: Job board, application tracking, document management, training modules, messaging
- **Admin Dashboard**: User management, system analytics, compliance monitoring, OCR processing, automation rules
- **Employee Dashboard**: HR workflow board, task management, internal communication

### Development Architecture
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Development Server**: Vite dev server with Express backend integration
- **Hot Reload**: Vite HMR for frontend with Express restart for backend changes
- **Testing**: Vitest for unit testing with React Testing Library
- **Type Safety**: Strict TypeScript configuration across all modules

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web application framework for REST API backend
- **react**: Frontend UI library with TypeScript support
- **@tanstack/react-query**: Server state management and caching

### Authentication & Security
- **Zoho Catalyst SDK**: Embedded authentication and serverless functions
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **@radix-ui/react-***: Accessible UI components (dialogs, forms, navigation)
- **tailwindcss**: Utility-first CSS framework with custom healthcare theme
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **drizzle-kit**: Database migration and introspection tools
- **@replit/vite-plugin-***: Replit-specific development plugins

### Form & Data Handling
- **@hookform/resolvers**: Form validation with Zod schemas
- **react-hook-form**: Form state management
- **drizzle-zod**: Schema validation from database schemas
- **date-fns**: Date manipulation and formatting

### Zoho Ecosystem Integration
- **Zoho CRM API**: Customer relationship management
- **Zoho Books API**: Financial management and time tracking
- **Zoho Calendar API**: Scheduling and appointment management
- **Zoho Learn API**: Training and certification management
- **Zoho Zia API**: AI-powered document processing and analytics