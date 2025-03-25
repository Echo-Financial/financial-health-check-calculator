import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Typography, Container, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles/index.js'; // Fully specify the extension
import MenuIconRaw from '@mui/icons-material/Menu.js'; // Fully specify the extension
import logo from '../../assets/images/EchoLogo.png';
const MenuIcon = MenuIconRaw.default || MenuIconRaw; // Ensure we use the default export


const StyledHeaderLink = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation links array
  const navItems = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQs', href: '#faq' },
  ];

  // Drawer content for mobile
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', paddingTop: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Financial Health
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        className="site-header"
        role="banner"
        color="transparent"
        elevation={0}
        sx={{ padding: "10px 0", overflowX: "hidden" }}
      >
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link to="/" className="site-logo" aria-label="Home - Financial Health Check Calculator">
              <img
                src={logo}
                alt="Financial Health Check Calculator Logo"
                style={{ width: "150px", maxWidth: "100%" }}
              />
            </Link>
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <StyledHeaderLink key={item.label} href={item.href}>
                  <Typography variant="body1" color="initial" sx={{ color: "grey" }}>
                    {item.label}
                  </Typography>
                </StyledHeaderLink>
              ))}
            </Box>
            {/* Mobile Hamburger Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
