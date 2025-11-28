# Debugging Guide: Figma-Generated React Project

This guide will help you debug and maintain your Figma-generated React code as a working React project.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Common Issues & Solutions](#common-issues--solutions)
3. [Development Workflow](#development-workflow)
4. [Debugging Tools](#debugging-tools)
5. [Keeping UI Intact](#keeping-ui-intact)

## Project Structure

Your project has two React setups:
- **Root project** (`/`): Main project with Figma-generated components
- **my-app** (`/my-app`): Separate Vite React project (can be ignored)

### Key Files
- `index.html` - Entry point
- `src/main.tsx` - React app entry
- `src/App.tsx` - Main app component
- `src/components/` - All your Figma-generated components
- `src/index.css` - Tailwind CSS v4 styles (Figma-generated)
- `vite.config.ts` - Vite configuration
- `package.json` - Dependencies

## Common Issues & Solutions

### 1. TypeScript Errors: "Cannot find module 'lucide-react'"

**Problem**: Missing dependency or incorrect installation.

**Solution**:
```bash
npm install lucide-react
```

### 2. React Import Errors: "'React' refers to a UMD global"

**Problem**: TypeScript configuration missing or incorrect JSX settings.

**Solution**: 
- Ensure `tsconfig.json` has `"jsx": "react-jsx"` (already fixed)
- In React 17+, you don't need `import React from 'react'` for JSX, but TypeScript needs proper config

### 3. Tailwind CSS Not Working

**Problem**: Tailwind v4 uses CSS variables, not a config file.

**Solution**: 
- Your `src/index.css` already contains all Tailwind styles (Figma-generated)
- No `tailwind.config.js` needed for v4
- Make sure `index.css` is imported in `main.tsx` ✅ (already done)

### 4. Component Not Rendering

**Checklist**:
1. ✅ Component is exported correctly
2. ✅ Component is imported in `App.tsx`
3. ✅ Component is used in JSX
4. ✅ No console errors in browser DevTools
5. ✅ Check browser console for runtime errors

### 5. Styling Issues

**Problem**: Tailwind classes not applying.

**Solutions**:
- Verify `index.css` is imported in `main.tsx`
- Check browser DevTools to see if classes are applied
- Tailwind v4 uses CSS variables - check if they're defined in `:root`

## Development Workflow

### Starting the Development Server

```bash
# From project root
npm run dev
```

This will:
- Start Vite dev server on port 3000
- Enable hot module replacement (HMR)
- Open browser automatically

### Building for Production

```bash
npm run build
```

Output will be in `build/` directory.

### Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed imports

2. **Check Terminal Output**
   - Vite shows compilation errors
   - TypeScript errors appear here

3. **Verify Dependencies**
   ```bash
   npm install
   ```
   Ensures all packages from `package.json` are installed

4. **Type Checking**
   ```bash
   npx tsc --noEmit
   ```
   Checks for TypeScript errors without building

## Debugging Tools

### Browser DevTools
- **Elements**: Inspect DOM and CSS
- **Console**: JavaScript errors and logs
- **Network**: Check if files are loading
- **Sources**: Debug JavaScript with breakpoints

### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript and JavaScript Language Features** (built-in)

### React DevTools
Install browser extension:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Keeping UI Intact

### When Editing Components

1. **Preserve Tailwind Classes**
   - Don't remove Tailwind utility classes
   - Figma generates specific class combinations
   - Test visually after changes

2. **Maintain Component Structure**
   - Keep the same JSX structure
   - Don't change className strings unnecessarily
   - Preserve conditional rendering logic

3. **Test Responsive Design**
   - Check mobile view (DevTools device toolbar)
   - Verify breakpoints work (`md:`, `lg:`, etc.)

4. **Preserve Animations**
   - Keep transition classes (`transition-all`, `duration-*`)
   - Maintain hover states (`hover:*`)
   - Test interactive elements

### Best Practices

1. **Component Isolation**
   - Each component should be self-contained
   - Props should be typed with TypeScript interfaces
   - Use proper React hooks (`useState`, `useEffect`)

2. **State Management**
   - Keep state local to components when possible
   - Use props for parent-child communication
   - Consider Context API for shared state

3. **Error Handling**
   - Wrap async operations in try-catch
   - Provide fallback UI for errors
   - Log errors to console for debugging

4. **Performance**
   - Use React.memo for expensive components
   - Avoid unnecessary re-renders
   - Use `useCallback` and `useMemo` when needed

## Quick Fixes

### Fix Missing Imports
```typescript
// If you see "Cannot find module X"
npm install X
```

### Fix TypeScript Errors
```typescript
// Add type annotations
const [state, setState] = useState<Type>(initialValue);

// Fix JSX issues
// Ensure tsconfig.json has "jsx": "react-jsx"
```

### Fix Styling Issues
```css
/* Check if Tailwind classes exist in index.css */
/* If not, add them or use inline styles as fallback */
```

## Troubleshooting Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] TypeScript config correct (`tsconfig.json`)
- [ ] Vite config correct (`vite.config.ts`)
- [ ] `index.css` imported in `main.tsx`
- [ ] No console errors in browser
- [ ] Components properly exported/imported
- [ ] Props types match usage
- [ ] React DevTools installed
- [ ] Hot reload working

## Getting Help

1. Check browser console for errors
2. Check terminal for build errors
3. Verify all imports are correct
4. Ensure dependencies are installed
5. Check TypeScript configuration
6. Review component structure

## Next Steps

After fixing issues:
1. Test all components
2. Verify responsive design
3. Check accessibility
4. Optimize performance
5. Add error boundaries
6. Write tests (optional)

