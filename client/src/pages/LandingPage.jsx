import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import logo from '../../src/assets/logo.jpg';
import { useNavigate } from 'react-router-dom';
import Animation from '../components/ui/Animation'

function LandingPage() {
    const categories = ["Electronics", "Jewellery", "Bags", "Shoes", "Watches"];
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % categories.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                maxWidth: "100vw",
                minHeight: '100vh',
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
            }}
        >

            <Box
                sx={{
                    width: { xs: "100%", md: "50%" },
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    px: 2,
                }}
            >
                <Animation animation='slide-in-left'>
                    <Typography variant="h3" component="h2" fontWeight="bold">
                        Best place to choose <br />
                        your <Box component="span" sx={{ color: '#5962fc' }}>{categories[index]}</Box>.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        sx={{
                            fontSize: "1rem",
                            px: 3,
                            py: 1,
                            mt:1,
                            textTransform: "none",
                            '&:hover': {
                                backgroundColor: 'darkblue'
                            }
                        }}
                        onClick={() => navigate('/home')}
                    >
                        Shop Now
                    </Button>
                </Animation>
            </Box>

            <Box
                sx={{
                    width: { xs: "100%", md: "50%" },
                    display: "flex",
                    justifyContent: { xs: "center", md: "left" },
                    alignItems: "center",
                    p: 2,
                }}
            >
                <Animation animation='slide-in-right'>
                    <Box
                        component="img"
                        src={logo}
                        alt="logo"
                        sx={{
                            width: { xs: "60%", md: "60%" },
                            height: "auto",
                            objectFit: "contain",
                            mx: "auto",
                        }}
                    />
                </Animation>
            </Box>
        </Box>
    );
}

export default LandingPage;
