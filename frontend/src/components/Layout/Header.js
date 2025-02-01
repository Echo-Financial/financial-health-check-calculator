import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Typography, Container } from '@mui/material';
import { styled } from '@mui/material';
import logo from '../../assets/images/EchoLogo.png'

const StyledHeaderLink = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const Header = () => (
    <AppBar position="static" className="site-header" role="banner" color="transparent" elevation={0} sx={{padding: "10px 0"}}>
        <Toolbar  >
            <Container maxWidth={"lg"} sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Link to="/" className="site-logo" aria-label="Home - Financial Health Check Calculator">
              <img src={logo} alt="Financial Health Check Calculator Logo" width="150" />
            </Link>
            <nav className="main-nav" role="navigation" aria-label="Main navigation">
                <Box display="flex">
                   <StyledHeaderLink  href="#how-it-works"  >
                        <Typography variant="body1" color="initial" sx={{color: "grey"}}>How It Works</Typography>
                   </StyledHeaderLink>
                    <StyledHeaderLink  href="#features" >
                        <Typography variant="body1" color="initial" sx={{color: "grey"}}>Features</Typography>
                   </StyledHeaderLink>
                   <StyledHeaderLink href="#testimonials"  >
                         <Typography variant="body1" color="initial" sx={{color: "grey"}}>Testimonials</Typography>
                    </StyledHeaderLink>
                   <StyledHeaderLink href="#faq" >
                         <Typography variant="body1" color="initial" sx={{color: "grey"}}>FAQs</Typography>
                    </StyledHeaderLink>
                </Box>
            </nav>
                </Container>
        </Toolbar>
    </AppBar>
);

export default Header;