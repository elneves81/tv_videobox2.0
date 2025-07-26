# Copilot Instructions - TV Box App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React Native Expo application designed specifically for TV Box/Android TV devices. The app should be optimized for:

- **TV Navigation**: D-pad/remote control navigation
- **Performance**: Lightweight and fast loading
- **TV Screen**: Large screen layouts (1080p/4K)
- **Media Playback**: Video and audio streaming
- **Simple UX**: Easy to use with remote control

## Development Guidelines

### TV-Specific Requirements
- Use `react-native-tvos` patterns when possible
- Implement focus management for remote control navigation
- Design for 10-foot interface (larger fonts, buttons, spacing)
- Optimize for horizontal navigation
- Support key events (up, down, left, right, select, back)

### Performance
- Minimize bundle size
- Use lazy loading for screens
- Optimize images and assets
- Implement efficient list rendering with FlatList

### UI/UX Patterns
- Use large, touch-friendly buttons (min 48dp)
- High contrast colors for TV viewing
- Clear visual feedback for focused elements
- Horizontal scrolling layouts
- Grid-based layouts for content

### Code Structure
- Components should be in `/components` folder
- Screens should be in `/screens` folder
- Use TypeScript for type safety
- Follow React Native best practices
- Keep components small and focused

### Media Features
- Support for video playback
- Audio streaming capabilities
- Playlist management
- Favorites system
- Search functionality

### Navigation
- Use React Navigation with TV-optimized patterns
- Implement proper focus management
- Support hardware back button
- Breadcrumb navigation for deep screens
