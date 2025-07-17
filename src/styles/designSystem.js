// Mio Design System - Consistent styling across the application
export const designSystem = {
  // Color Palette - Clean and Professional
  colors: {
    primary: {
      blue: {
        50: '#eff6ff',
        100: '#dbeafe', 
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      },
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8', 
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843'
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87'
      }
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      display: ['Playfair Display', 'serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },

  // Spacing Scale (rem units)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem'      // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: {
      blue: '0 0 20px rgb(59 130 246 / 0.3)',
      pink: '0 0 20px rgb(236 72 153 / 0.3)',
      purple: '0 0 20px rgb(168 85 247 / 0.3)'
    }
  },

  // Glassmorphism Effects
  glassmorphism: {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem'
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '1.5rem'
    },
    heavy: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '2rem'
    }
  },

  // Gradient Presets
  gradients: {
    couple: {
      primary: 'linear-gradient(135deg, #60a5fa 0%, #f472b6 100%)',
      soft: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 100%)',
      vibrant: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #a855f7 100%)'
    },
    person: {
      giaminh: {
        primary: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        soft: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        glow: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)'
      },
      baongoc: {
        primary: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
        soft: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
        glow: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)'
      }
    },
    background: {
      main: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      overlay: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.8) 100%)'
    }
  },

  // Animation Presets
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '750ms'
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    scale: {
      hover: 1.02,
      active: 0.98,
      focus: 1.05
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
};

// Utility functions for consistent styling
export const getPersonTheme = (personId) => {
  const themes = {
    giaminh: {
      colors: designSystem.colors.primary.blue,
      gradient: designSystem.gradients.person.giaminh,
      emoji: '🦁',
      name: 'Gia Minh'
    },
    baongoc: {
      colors: designSystem.colors.primary.pink,
      gradient: designSystem.gradients.person.baongoc,
      emoji: '🌸', 
      name: 'Bảo Ngọc'
    }
  };
  return themes[personId] || themes.giaminh;
};

export const createGlassStyle = (variant = 'medium') => {
  const glass = designSystem.glassmorphism[variant];
  return {
    background: glass.background,
    backdropFilter: glass.backdropFilter,
    WebkitBackdropFilter: glass.backdropFilter,
    border: glass.border,
    borderRadius: glass.borderRadius
  };
};

export const createShadowStyle = (variant = 'base', color = null) => {
  if (color && designSystem.shadows.glow[color]) {
    return {
      boxShadow: `${designSystem.shadows[variant]}, ${designSystem.shadows.glow[color]}`
    };
  }
  return {
    boxShadow: designSystem.shadows[variant]
  };
};

export default designSystem;
