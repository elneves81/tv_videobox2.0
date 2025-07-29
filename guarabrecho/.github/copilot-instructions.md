# Copilot Instructions for GuaraBrechó

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
GuaraBrechó is a digital marketplace for buying, selling, trading, and donating used products in Guarapuava city. The platform focuses on local community engagement and sustainable commerce.

## Tech Stack
- Frontend: Next.js 15 with TypeScript and App Router
- Styling: Tailwind CSS
- Authentication: NextAuth.js (to be implemented)
- Database: PostgreSQL with Prisma ORM (to be implemented)
- File uploads: Next.js with cloud storage integration
- WhatsApp integration for contact functionality

## Key Features to Implement
1. User authentication and registration ✅
2. Product listing with photos, descriptions, location (neighborhood), price, and category ✅
3. **Homepage with dealership-style layout** - Clean product showcase ✅
4. **FeaturedProductCard component** - Optimized for product display ✅
5. **Image compression and optimization** ✅
6. Search and filter functionality by neighborhood and category
7. Product detail pages with WhatsApp contact integration ✅
8. User dashboard for managing personal listings ✅
9. Responsive design optimized for mobile devices ✅

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with mobile-first approach
- Implement proper error handling and loading states
- Use React hooks and modern patterns
- Prefer functional components over class components
- Use proper TypeScript types and interfaces

## Component Structure
- Keep components small and focused on single responsibilities
- Use proper props typing with TypeScript interfaces
- Implement proper SEO with Next.js metadata API
- Use Next.js Image component for optimized images
- Follow accessibility best practices

## Specific Implementation Notes
- **Homepage Layout**: Dealership-style design focused on product showcase
- **FeaturedProductCard**: Component with prominent pricing, images, and clean information layout
- **Image Optimization**: Automatic compression and resizing for web performance
- **Product Filtering**: Smart filtering prioritizing products with images
- **Responsive Grid**: 4-column layout on desktop, adapting to smaller screens
- WhatsApp contact should open WhatsApp Web/app with pre-filled message
- Products should include neighborhood information for local focus
- Categories should include: Roupas, Eletrônicos, Móveis, Livros, Esportes, etc.
- Support for product images with multiple photos per listing
- Transaction types: Venda, Troca, Doação
