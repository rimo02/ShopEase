import { useEffect, useState } from 'react';
import { TextField, Container, IconButton, Button, Paper, Typography, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { loginAsync as login } from '../../redux/slice/authSlice';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);

    useEffect(() => {
        if (isUserLoggedIn) {
            navigate("/")
        }
    }, [isUserLoggedIn, navigate])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password })).then((res) => {
            if (!res.error) {
                setTimeout(() => {
                    navigate("/")
                }, 2000);
            }
            else {
                console.log('fail')
                return
            }
        })
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                maxWidth: '100%',
                overflowX: 'hidden',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Login
                </Typography>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </Box>

                    <Link
                        to="/forgot"
                        style={{
                            alignSelf: 'flex-end',
                            fontSize: '0.875rem',
                            color: '#1976d2',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                    >
                        Forgot Password?
                    </Link>

                    <Button type="submit" variant="contained" fullWidth sx={{}}>
                        Login
                    </Button>
                </form>
                <p className='mt-2'>Dont Have an account?  <strong className='cursor-pointer' onClick={() => navigate('/signup')}>Create One</strong></p>

            </Paper>
        </Container>
    );
}
