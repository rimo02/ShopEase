import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Container, TextField, Box, Button, Badge, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Slider } from '@mui/material'
import logo from '../../../public/shopping_website_logo.jpeg'
import { ShoppingCart } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { calculateTotalQuantity } from '../../redux/slice/cartSlice'
import debounce from 'lodash.debounce'
import { Menu, X } from 'lucide-react'
import { FilterContext } from '../../context/FilterContext'

function Header() {
  const username = useSelector((state) => state.auth.username);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchItem, setSearchItem] = useState("")
  const totalQuantity = useSelector((state) => state.cart.totalQuantity)
  const [menuOpen, setMenuOpen] = useState(false);
  const { filters, setFilters } = useContext(FilterContext)

  const debounceSearch = useCallback(
    debounce((query) => {
      navigate(`/?search=${encodeURIComponent(query)}`)
    }, 500),
    [])

  useEffect(() => {
    dispatch(calculateTotalQuantity())
  }, [dispatch, totalQuantity])

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchItem(val)
    if (val.length < 4) return;
    debounceSearch(val)
  }

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
        display: "flex",
        justifyContent: "space-between",
        height: "8vh",
        width: "100vw",
        bgcolor: "#FDFEFFFF",
        color: "fff",
        p: 1,
        pr: 2,
        position:"fixed",
        top:0
      }
    }
    >
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: { xs: "80px", lg: "100px" },
            height: "auto"
          }}
        />
      </Box>
      <TextField
        variant="outlined"
        placeholder="Search products..."
        size="small"
        sx={{
          width: { xs: '25vw', md: '50vw' },
          bgcolor: "white",
          borderRadius: 2,
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          justifyContent: 'center',
        }}
        value={searchItem}
        onChange={handleChange}
      />
      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <Badge badgeContent={totalQuantity} color="secondary">
          <Button variant="contained" color="primary" startIcon={<ShoppingCart sx={{ fontSize: { xs: 16, sm: 20 } }} />} onClick={() => navigate('/cart')}
            sx={{
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              padding: { xs: '0.3rem 0.5rem', sm: '0.5rem 1rem' },
              minWidth: { xs: '64px', sm: 'auto' }
            }}
          >
            Cart
          </Button>
        </Badge>
        <Button variant="outlined" color="primary" onClick={() => navigate('/login')}
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            padding: { xs: '0.3rem 0.6rem', sm: '0.5rem 1rem' },
          }}
        >
          {username ? username : "Login"}
        </Button>
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className='cursor-pointer'
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Box>
      {
        menuOpen && (
          <Paper sx={{ width: "60", p: 5, height: "screen", position: "fixed", top: '8vh', right: 0, zIndex: 1000 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
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
              sx={{ width: '90%', mt: 1 }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Typography>
          </Paper>
        )
      }
    </Container>

  )
}

export default Header