import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgetAsync as forgot } from '../../redux/slice/authSlice';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
} from '@mui/material';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgot(email)).then((res) => {
            if (!res.error) {
                setTimeout(() => {
                    navigate('/reset', { state: { email } });
                }, 2000);
            } else {
                console.log('fail')
                return
            }
        });
    };

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '20vh', pt: 8 }}
        >
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Forgot Password?
                </Typography>

                <form onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
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
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Send OTP
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default ForgotPassword;