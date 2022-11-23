module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },

    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      md: '1rem',
      lg: '1.2rem',
      xl: '1.4rem',
      '2xl': '1.6rem',
      '3xl': '2rem',
      '4xl': '2.25rem',
    },

    extend: {
      colors: {
        // TechEquity theme colors
        blue: {
          dark: '#112353',
          DEFAULT: '#172F6E',
          light: '#45598b',
          lighter: '#006ac3',
          lightest: '#E3EBFF',
        },
        green: '#85CA83',
        // #4F515A - input border/input text color (default)
        // #F5F5F5 - input background color (lightest)
        // #777f87 - input placeholder color (light)

        // #414247 - text color (darker)
        // #3C3E47 - dropdown menu text (darkest)
        // #e8e9eb - dropdown background color/ progress bar background (lighter)
        gray: {
          darkest: '#3C3E47',
          darker: '#112353',
          dark: '#414247',
          DEFAULT: '#4F515A',
          light: '#777F87',
          lighter: '#E8E9EB',
          lightest: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
};
