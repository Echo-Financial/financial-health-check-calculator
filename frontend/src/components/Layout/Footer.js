import React from 'react';
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box, Typography } from '@mui/material';
import { styled } from '@mui/material';

const StyledFooterLink = styled(BottomNavigationAction)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
    padding: '8px',
    '&:hover':{
     textDecoration: 'underline',
    }
}));

const Footer = () => (
  <Box component="footer" className="site-footer" role="contentinfo" sx={{padding: '50px 0'}}>
    <Box className="container">
      <BottomNavigation
       showLabels
        aria-label="Footer navigation"
      >
          <StyledFooterLink label="Privacy Policy" to="/privacy" component={Link}/>
         <StyledFooterLink label="Terms of Service" to="/terms" component={Link}/>
          <StyledFooterLink label="About Us" to="/about" component={Link}/>
         <StyledFooterLink label="Contact" to="/contact" component={Link}/>
      </BottomNavigation>
        <Box sx={{marginTop: '10px', textAlign: 'center'}}><Typography variant="body2" >© {new Date().getFullYear()} Financial Health Check Calculator. All rights reserved.</Typography></Box>
    </Box>
  </Box>
);

export default Footer;