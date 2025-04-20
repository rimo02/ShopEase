import React, { useCallback, useEffect, useState } from 'react'
import { Container, TextField, Box, Button, Badge } from '@mui/material'
import logo from '../../assets/logo.png'
import { ShoppingCart } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { calculateTotalQuantity } from '../../redux/slice/cartSlice'
import debounce from 'lodash.debounce'

function Header() {
  const username = useSelector((state) => state.auth.username);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchItem, setSearchItem] = useState("")
  const totalQuantity = useSelector((state) => state.cart.totalQuantity)
  useEffect(() => {
    dispatch(calculateTotalQuantity())
  }, [dispatch, totalQuantity])


  const debounceSearch = useCallback(
    debounce((query) => {
      navigate(`/?search=${encodeURIComponent(query)}`)
    }, 500),
    [])

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchItem(val)
    if (val.length < 4) return;
    debounceSearch(val)
  }

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
        pr: 2
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src={logo} alt="logo" style={{ height: "30px" }} />
      </Box>
      <TextField
        variant="outlined"
        placeholder="Search products..."
        size="small"
        sx={{
          width: "40%",
          bgcolor: "white",
          borderRadius: 0,
        }}
        value={searchItem}
        onChange={handleChange}
      // onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Badge badgeContent={totalQuantity} color="secondary">
          <Button variant="contained" color="primary" startIcon={<ShoppingCart />} onClick={() => navigate('/cart')}>
            Cart
          </Button>
        </Badge>
        <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
          {username ? username : "Login"}
        </Button>
      </Box>

    </Container>
  )
}

export default Header