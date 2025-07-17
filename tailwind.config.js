/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
        body: ['Lexend', 'sans-serif'],
        heading: ['Spectral', 'serif'],
      },
      colors: {
        mystic: {
          purple: '#9F6FFF',
          peach: '#FAD0C4',
          blue: '#A1C4FD',
        },
        planet: {
          sun: '#FFA726',      // Mặt Trời - cam vàng
          moon: '#E1E1E1',     // Mặt Trăng - bạc
          mercury: '#8BC34A',   // Sao Thủy - xanh lá
          venus: '#FF7043',    // Sao Kim - hồng cam
          mars: '#E53935',     // Sao Hỏa - đỏ
          jupiter: '#5C6BC0',  // Sao Mộc - tím xanh
          saturn: '#8D6E63',   // Sao Thổ - nâu
          ascendant: '#00BCD4', // Cung Mọc - xanh ngọc
        },
        sign: {
          libra: '#FFCDD2',     // Thiên Bình - hồng nhạt
          leo: '#FFE082',       // Sư Tử - vàng
          virgo: '#C8E6C9',     // Xử Nữ - xanh mint
          scorpio: '#D1C4E9',   // Bọ Cạp - tím nhạt
          gemini: '#B3E5FC',    // Song Tử - xanh nước biển
        }
      },
      backgroundImage: {
        'gradient-mystic': 'linear-gradient(135deg, #9F6FFF 0%, #FAD0C4 50%, #A1C4FD 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'gradient-luxury': 'linear-gradient(135deg, rgba(159, 111, 255, 0.05) 0%, rgba(250, 208, 196, 0.05) 50%, rgba(161, 196, 253, 0.05) 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(159, 111, 255, 0.5)',
        'planet': '0 0 25px rgba(255, 255, 255, 0.25)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 8s infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 25s linear infinite reverse',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.7))' },
          '100%': { filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.9))' },
        }
      },
      typography: {
        DEFAULT: {
          css: {
            letterSpacing: '-0.01em',
            fontFeatureSettings: '"liga" 1, "salt" 1, "ss01" 1, "ss02" 1',
          }
        }
      },
      letterSpacing: {
        'tightest': '-.075em',
        'tighter': '-.05em',
        'tight': '-.025em',
        'normal': '0',
        'wide': '.025em',
        'wider': '.05em',
        'widest': '.1em',
        'artistic': '.15em',
      },
    },
  },
  plugins: [],
} 