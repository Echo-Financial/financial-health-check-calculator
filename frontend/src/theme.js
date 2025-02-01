// theme.js
import { createTheme } from '@mui/material';

// We can't import SASS variables directly, so let's mirror them here:
const brandPrimary = '#1F3C78';   // Navy
const brandSecondary = '#2CA58D'; // Teal
// If you want an "accent" in MUI, you can define custom property or pass it in as 'warning', 'info', etc.

function colorFromScore(score) {
  const hue = (120 * (score / 100)).toFixed(2);
  return `hsla(${hue}, 100%, 50%, 0.6)`;
}

function borderColorFromScore(score) {
  const hue = (120 * (score / 100)).toFixed(2);
  return `hsla(${hue}, 100%, 50%, 1)`;
}

const theme = createTheme({
  palette: {
    primary: {
      main: brandPrimary, 
    },
    secondary: {
      main: brandSecondary,
    },
    // Custom color functions
    colorFromScore,
    borderColorFromScore,
  },
  typography: {
    // Body text = Open Sans
    fontFamily: 'Open Sans, Arial, sans-serif',

    // Override specific headings to Merriweather if desired
    h1: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      // optionally also set the heading font:
      fontFamily: 'Merriweather, serif',
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: 0,
        },
      },
    },
  },
});

export default theme;
