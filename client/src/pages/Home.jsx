import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Container, Box, Paper, FormGroup, FormControlLabel, Checkbox, Slider } from '@mui/material';
import MediaCard from '../components/Items/MediaCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        electronics: false,
        household: false,
        clothing: false,
        fashion: false,
        beauty: false,
        priceRange: [0, 10000],
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);


    const handleItems = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
    }
    const handlePriceRange = (event, newValue) => {
        setFilters({ ...filters, priceRange: newValue });
    };

    const isAnyCategorySelected = Object.keys(filters).some(
        (key) => key !== "priceRange" && filters[key]
    );

    const filteredProducts = products.filter((product) => {
        const inCategory = !isAnyCategorySelected ||
            (filters.electronics && product.categories.includes("electronics")) ||
            (filters.household && product.categories.includes("household")) ||
            (filters.fashion && product.categories.includes("fashion")) ||
            (filters.beauty && product.categories.includes("beauty")) ||
            (filters.clothing && product.categories.includes("clothing"));

        const inPriceRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

        return inCategory && inPriceRange;
    });



    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>Error: {error}</Typography>;

    return (
        <Box maxWidth="100%" sx={{ display: "flex", mt: 4, }}>
            <Paper sx={{ width: 250, p: 3, height: "fit-content", position: "sticky", ml: 1 ,}}>
                <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
                <FormGroup>
                    <FormControlLabel control={<Checkbox name="electronics" checked={filters.electronics} onChange={handleItems} />} label="Electronics" />
                    <FormControlLabel control={<Checkbox name="household" checked={filters.household} onChange={handleItems} />} label="Household Essentials" />
                    <FormControlLabel control={<Checkbox name="fashion" checked={filters.fashion} onChange={handleItems} />} label="Fashion" />
                    <FormControlLabel control={<Checkbox name="beauty" checked={filters.beauty} onChange={handleItems} />} label="Health and Beauty" />
                    <FormControlLabel control={<Checkbox name="clothing" checked={filters.clothing} onChange={handleItems} />} label="Clothing" />
                </FormGroup>
                <Typography variant="body1" sx={{ mt: 3 }}>Price Range</Typography>
                <Slider
                    value={filters.priceRange}
                    onChange={handlePriceRange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100000}
                    sx={{ width: '90%', mt: 1 }} />
            </Paper>

            <Box sx={{ flexGrow: 1, ml: 5, display: "flex", flexWrap: "wrap" }}>
                {filteredProducts.map((product) => (
                    <Box
                        key={product.id}
                        sx={{
                            width: { xs: "100%", sm: "48%", md: "32%", lg: "24%" },
                            padding: 1,
                        }}
                    >
                        <MediaCard
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            discount={product.discount}
                            url={product.imgUrl}
                            categories={product.categories}
                            id={product.id}
                        />
                    </Box>
                ))}
            </Box>

        </Box>
    );
}
