// Breakpoints constantes para consistência entre JS e CSS
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const MOBILE_BREAKPOINT = BREAKPOINTS.md; // 768px - alinhado com Tailwind md:
export const TABLET_BREAKPOINT = BREAKPOINTS.lg; // 1024px - alinhado com Tailwind lg: