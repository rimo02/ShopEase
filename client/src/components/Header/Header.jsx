import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Container, TextField, Box, Button, Badge,
  Typography, Paper, FormGroup, FormControlLabel, Checkbox, Slider
} from '@mui/material';
import logo from '../../assets/shopping_website_logo.jpeg';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { calculateTotalQuantity } from '../../redux/slice/cartSlice';
import debounce from 'lodash.debounce';
import { Menu, X } from 'lucide-react';
import { FilterContext } from '../../context/FilterContext';

function Header() {
  const username = useSelector((state) => state.auth.username);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchItem, setSearchItem] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { filters, setFilters } = useContext(FilterContext);

  const debounceSearch = useCallback(
    debounce((query) => {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }, 500),
    []
  );

  useEffect(() => {
    dispatch(calculateTotalQuantity());
  }, [dispatch]);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchItem(val);
    if (val.length < 4) return;
    debounceSearch(val);
  };

  const handleItems = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  const handlePriceRangeChange = (_, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '8vh',
        width: '100%',
        bgcolor: 'rgba(0, 27, 57, 1)',
        color: 'white',
        px: 2,
        position: 'fixed',
        top: 0,
        zIndex: 1201,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: { xs: '70px', sm: '90px' },
            height: 'auto'
          }}
        />
      </Box>

      {/* Search Field */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
        <TextField
          placeholder="Search products..."
          size="small"
          value={searchItem}
          onChange={handleChange}
          sx={{
            width: { xs: '100%', sm: '60%', md: '50%' },
            bgcolor: 'white',
            borderRadius: 2,
            input: { py: 1 },
          }}
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Badge badgeContent={totalQuantity} color="secondary">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={() => navigate('/cart')}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: 2,
              py: 1,
              borderRadius: 2,
              minWidth: '64px'
            }}
          >
            Cart
          </Button>
        </Badge>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: 2,
            py: 1,
            bgcolor: 'white',
            color: 'primary.main',
            borderRadius: 2
          }}
        >
          {username || 'Login'}
        </Button>

        <Box
          onClick={() => setMenuOpen(prev => !prev)}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {menuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
        </Box>
      </Box>

      {/* Filter Drawer */}
      {menuOpen && (
        <Paper
          elevation={4}
          sx={{
            width: { xs: '80vw', sm: '300px' },
            p: 3,
            position: 'fixed',
            top: '8vh',
            right: 0,
            height: '92vh',
            zIndex: 1300,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" color='primary' sx={{ mb: 2 }}>Filters</Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox name="electronics" checked={filters.electronics} onChange={handleItems} />} label="Electronics" />
            <FormControlLabel control={<Checkbox name="household" checked={filters.household} onChange={handleItems} />} label="Household Essentials" />
            <FormControlLabel control={<Checkbox name="fashion" checked={filters.fashion} onChange={handleItems} />} label="Fashion" />
            <FormControlLabel control={<Checkbox name="beauty" checked={filters.beauty} onChange={handleItems} />} label="Health and Beauty" />
            <FormControlLabel control={<Checkbox name="accessories" checked={filters.accessories} onChange={handleItems} />} label="Accessories" />
          </FormGroup>
          <Typography variant="body1" sx={{ mt: 3 }}>Price Range</Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default Header;
