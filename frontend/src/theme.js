import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    colorFromScore: (score) => `hsl(calc(120deg * (${score} / 100)), 100%, 50%, 0.6)`,
    borderColorFromScore: (score) => `hsl(calc(120deg * (${score} / 100)), 100%, 50%, 1)`,
  },
});

export default theme;