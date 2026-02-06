# Refactoring Documentation

This document describes the modular refactoring applied to the daylennguyen.github.io codebase for improved maintainability, scalability, and testability.

## Directory Structure

```
app/
├── components/
│   ├── ChickenCanvas/
│   │   ├── index.tsx          # Main component
│   │   ├── config.ts          # Animation & sprite configs
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── __tests__/
│   │       └── config.test.ts # Unit tests
│   ├── FishCanvas/
│   │   ├── index.tsx
│   │   ├── config.ts
│   │   ├── types.ts
│   │   └── __tests__/
│   │       └── config.test.ts
│   ├── DraggableWindow.tsx    # Reusable draggable window
│   ├── LoadingScreen.tsx      # Loading screen component
│   ├── Taskbar.tsx            # Taskbar with buttons and clock
│   ├── StartMenu.tsx          # Start menu dropdown
│   └── React95Provider.tsx    # React95 theme provider
├── hooks/
│   ├── useWindowDrag.ts       # Reusable window drag hook
│   └── __tests__/
│       └── useWindowDrag.test.ts
├── lib/
│   ├── constants.ts           # Shared constants (URLs, durations)
│   ├── formatTime.ts          # Time formatting utility
│   └── __tests__/
│       └── formatTime.test.ts
├── page.tsx                   # Main page (simplified)
└── layout.tsx

stories/
├── ChickenCanvas.stories.tsx
├── FishCanvas.stories.tsx
├── DraggableWindow.stories.tsx
├── LoadingScreen.stories.tsx
├── Taskbar.stories.tsx
└── AlagardFont.stories.tsx
```

## Key Improvements

### 1. **Modularity**
- **Canvas components** organized into folders with separate `config.ts` and `types.ts`
- **Reusable components** extracted (`DraggableWindow`, `Taskbar`, `StartMenu`, `LoadingScreen`)
- **Custom hooks** for shared logic (`useWindowDrag`)
- **Utilities** centralized in `app/lib/`

### 2. **Scalability**
- Adding new windows is now a single `<DraggableWindow>` component
- Window drag logic is reusable via `useWindowDrag` hook
- Constants are centralized and easy to modify
- Canvas configs are separated from rendering logic

### 3. **Testability**
- Unit tests for hooks (`useWindowDrag`)
- Unit tests for utilities (`formatTime`)
- Config tests for canvas components
- Storybook stories for visual testing and documentation

### 4. **Code Quality**
- **DRY principle**: No repeated drag logic across windows
- **Single responsibility**: Each component does one thing
- **Type safety**: Proper TypeScript interfaces for all data structures
- **Separation of concerns**: Config, types, and logic are separated

## Component API

### DraggableWindow
```tsx
<DraggableWindow
  title="Window Title"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialPosition={{ x: 0, y: 0 }}
  positionMode="translate" // or "rightTop"
  contentClassName="!p-0" // optional
>
  {children}
</DraggableWindow>
```

### useWindowDrag Hook
```tsx
const { position, isDragging, handleTitleBarMouseDown } = useWindowDrag(
  { x: 0, y: 0 },
  { mode: "translate" }
);
```

### Taskbar
```tsx
<Taskbar
  buttons={[
    { label: "Window", icon: "🧙", active: true, onClick: () => {} }
  ]}
  onFishyClick={() => {}}
/>
```

## Running Tests

```bash
# Run all tests
npm test

# Run Storybook
npm run storybook
```

## Future Enhancements

- Extract canvas rendering logic into custom hooks (e.g., `useCanvasAnimation`)
- Create a `WindowManager` context for global window state
- Add more unit tests for component interactions
- Consider extracting physics logic from ChickenCanvas into a separate module
