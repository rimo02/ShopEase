import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signupAsync as signup } from '../../redux/slice/authSlice'
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useSelector } from 'react-redux'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup({ email, username, password })).then((res) => {
      console.log(res)
      if (!res.error) {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        console.log('fail');
        return;
      }
    });
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate("/")
    }
  }, [isUserLoggedIn, navigate])


  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '20vh', pt: 8 }}
    >

      <Paper elevation={3} sx={{ p: 3, width: '100%', borderRadius: 2 }} >
        <Typography component="h2" variant="h5" align="center" gutterBottom>
          SignUp
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mb: 1 }}>
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;