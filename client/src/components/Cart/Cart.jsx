import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  Box,
} from '@mui/material';
import CartCard from '../Items/CartCard';
import { calculateTotalPrice } from '../../redux/slice/cartSlice.js';

function Cart() {
  const products = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(calculateTotalPrice());
  }, [dispatch, products]);

  return (
    <Box sx={{ p: 3 }}>
      {products && products.length > 0 ? (
        <Grid container spacing={2}>
          {/* Left: Cart Items */}
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} key={product.id}>
                  <CartCard
                    name={product.name}
                    price={product.price}
                    url={product.url}
                    id={product.id}
                    qty={product.qty}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right: Order Summary */}
          <Grid item xs={12} sm={4}>
            <Paper
              sx={{
                p: 4,
                width: '100%',
                maxWidth: 400,
                boxShadow: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {products.map((product) => (
                <Typography key={product.id} variant="body2" sx={{ mt: 1 }}>
                  {product.qty} x {product.name} - ${' '}
                  {(product.price * product.qty).toFixed(2)}
                </Typography>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total: ${totalPrice}
              </Typography>
              <Button
                sx={{ color: 'white', bgcolor: 'green', mt: 1 }}
                variant="contained"
                onClick={() => navigate('/checkout', { state: { totalPrice } })}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">Your cart is empty.</Typography>
      )}
    </Box>
  );
}

export default Cart;
