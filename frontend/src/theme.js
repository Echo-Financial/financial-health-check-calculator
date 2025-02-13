import { createTheme } from '@mui/material';

// We can't import SASS variables directly, so let's mirror them here:
const brandPrimary = '#101828';
const brandAccent = '#c68922';
const brandLink = '#5dc8e8';
const brandLinkHover = '#47a3c4';


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
      main: brandAccent, // Use brandAccent for secondary color
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
      color: 'white',
    },
    h2: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      lineHeight: 1.2,
      color: brandAccent,
    },
    h3: {
      fontFamily: 'Merriweather, serif',
      fontWeight: 700,
      lineHeight: 1.2,
      color: brandAccent,
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
      MuiLink: {
          styleOverrides: {
             root: {
                 color: brandLink,
                 '&:hover': {
                     color: brandLinkHover,
                 },
             },
        },
      },
  },
});

export default theme;