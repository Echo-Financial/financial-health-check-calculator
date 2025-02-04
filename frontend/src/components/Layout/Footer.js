import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Typography } from '@mui/material';
import { styled } from '@mui/material';

const StyledFooterLink = styled(BottomNavigationAction)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  padding: '8px',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Footer = () => (
  <Box
    component="footer"
    className="site-footer"
    role="contentinfo"
    data-testid="main-footer" // Added unique test identifier here
    sx={{ padding: '50px 0' }}
  >
    <Box className="container">
      <BottomNavigation aria-label="Footer navigation" showLabels>
        <StyledFooterLink
          label="Privacy Policy"
          href="https://www.echo-financial-advisors.co.nz/echo-financial-advisors-privacy-statement"
          component="a"
          target="_blank"
          rel="noopener noreferrer"
        />
        <StyledFooterLink
          label="Terms of Service"
          href="https://www.echo-financial-advisors.co.nz/echo-financial-advisors-terms-conditions"
          component="a"
          target="_blank"
          rel="noopener noreferrer"
        />
        <StyledFooterLink
          label="About Us"
          href="https://www.echo-financial-advisors.co.nz/why-choose-echo-financial-advisors"
          component="a"
          target="_blank"
          rel="noopener noreferrer"
        />
        <StyledFooterLink
          label="Contact"
          href="https://echofinancialadvisors.trafft.com/"
          component="a"
          target="_blank"
          rel="noopener noreferrer"
        />
      </BottomNavigation>
      <Box sx={{ marginTop: '10px', textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Echo Financial Advisors. All rights reserved.
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default Footer;
