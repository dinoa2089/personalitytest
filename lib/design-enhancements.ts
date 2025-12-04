/**
 * Design enhancement utilities for modern B2B2C visual appeal
 * Inspired by Linear, Vercel, Stripe, and Notion
 */

export const designTokens = {
  // Spacing scale - more generous spacing
  spacing: {
    xs: "0.5rem",    // 8px
    sm: "0.75rem",   // 12px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "3rem",   // 48px
    "3xl": "4rem",   // 64px
  },
  
  // Gradient combinations
  gradients: {
    primary: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
    primarySubtle: "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.05) 100%)",
    accent: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    warm: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    cool: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    success: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.05) 0%, transparent 50%)",
  },
  
  // Shadow elevations
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    glow: "0 0 20px hsl(var(--primary) / 0.3)",
  },
  
  // Border radius
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  
  // Animation timings
  transitions: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
};

export const modernCardStyles = {
  base: "rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300",
  elevated: "rounded-xl border border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300",
  glass: "rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl",
  gradient: "rounded-xl border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg",
};

export const modernButtonStyles = {
  primary: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300",
  secondary: "bg-background/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 transition-all duration-300",
};







