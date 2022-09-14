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

    extend: {
      colors: {
        // button colors
        blue: {
          dark: '#07246F',
          DEFAULT: '#172F6E',
          light: '#1B3C93',
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
          dark: '#414247',
          DEFAULT: '#4F515A',
          light: '#777f87',
          lighter: '#E8E9EB',
          lightest: '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
};
