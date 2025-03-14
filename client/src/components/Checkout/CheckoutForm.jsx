import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Typography, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import { calculateTotalQuantity, clearCart } from '../../redux/slice/cartSlice';
import { useDispatch } from 'react-redux';

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:5173"
      },
    });

    if (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "light"
      });
    } else {
      toast.success("Payment successful!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light"
      });
      dispatch(clearCart())
      dispatch(calculateTotalQuantity())
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: '0 auto',
        padding: 3,
        border: '1px solid #ccc',
        borderRadius: 4,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <PaymentElement />
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            type="submit"
            disabled={!stripe || !elements || loading}
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : "Pay"}
          </Button>
        </Box>
        {errorMessage && (
          <Typography variant="body2" color="error" align="center" mt={2}>
            {errorMessage}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default CheckoutForm;
