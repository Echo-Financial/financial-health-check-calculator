import { createTheme } from '@mui/material';
import { colorFromScore, borderColorFromScore } from './styles/variables.scss';


const theme = createTheme({
    palette: {
        primary: {
            main: '#00274D', // Navy, professional and trustworthy
        },
        secondary: {
            main: '#3CB371', // Teal/Green, suggests growth and success
        },
         colorFromScore: (score) => `hsl(calc(120deg * (${score} / 100)), 100%, 50%, 0.6)`,
        borderColorFromScore: (score) => `hsl(calc(120deg * (${score} / 100)), 100%, 50%, 1)`,
    },
    typography: {
        fontFamily: 'Nunito Sans, Arial, sans-serif',
         h1: {
           fontWeight: 700,
           lineHeight: 1.2,
         },
         h2: {
           fontWeight: 700,
           lineHeight: 1.2,
         },
        h3: {
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h4:{
          fontWeight: 600,
        }
    },
    spacing: 8,
    components: {
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                margin: 0,
            },
        }
    }
}
});

export default theme;