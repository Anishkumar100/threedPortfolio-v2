// ThemeContext.jsx — stable
//
// WHY THE ORIGINAL CAUSED EXTRA RE-RENDERS:
//
//   Every render of ThemeProvider created a new `{ theme, toggleTheme }`
//   object. React context compares value by reference. A new object reference
//   means ALL context consumers re-render — even if theme didn't change.
//
//   `toggleTheme` was also recreated every render (inline arrow function),
//   so even `useMemo`-ing the context value would fail because toggleTheme
//   was always a new function reference (a dependency that always changes).
//
//   Cascade effect:
//     ThemeProvider re-renders for any reason
//       → new toggleTheme (inline arrow, always new reference)
//         → new { theme, toggleTheme } (new object even if theme unchanged)
//           → ProjectProcess re-renders
//             → Canvas children reconcile
//               → BatarangModel re-renders
//                 → HeroModel re-renders
//                   → useLayoutEffect([visible]) fires unnecessarily
//                     → initialized.current = false
//                       → model snaps/flashes on next frame
//
// THE FIX:
//   1. useCallback for toggleTheme — stable reference across renders.
//   2. useMemo for context value — only changes when theme actually changes.
//
//   Now consumers (ProjectProcess, etc.) only re-render when theme truly
//   changes, not on every ThemeProvider render.
//
// THE DOUBLE RENDERS IN YOUR CONSOLE:
//   "ThemeProvider render dark" × 2 is React 18 StrictMode (development only).
//   StrictMode intentionally double-invokes renders and effects to help catch
//   side effects. This is expected and disappears in production builds.
//   It is NOT a bug and is NOT related to your model loading issue.

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('portfolio-theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  console.log('ThemeProvider render', theme)
  // useCallback: stable reference — doesn't change between renders.
  // Without this, useMemo below would see a new dep every render and
  // recompute, defeating the purpose.
  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [] // setTheme is stable (React guarantee), so no deps needed
  )

  // useMemo: context value only changes when theme changes.
  // Consumers (ProjectProcess, navbar, etc.) only re-render on real
  // theme toggles — not on any unrelated ThemeProvider re-render.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)