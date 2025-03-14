import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Pagination, Box, Paper, FormGroup, FormControlLabel, Checkbox, Slider } from '@mui/material';
import MediaCard from '../components/Items/MediaCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        electronics: false,
        household: false,
        fashion: false,
        beauty: false,
        priceRange: [0, 100000],
    });
    const [tempPriceRange, setTempPriceRange] = useState([0, 100000]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 25;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const selectedCategories = Object.keys(filters)
                    .filter((key) => key !== "priceRange" && filters[key])
                    .join(",");

                const queryParams = new URLSearchParams({
                    page,
                    limit: itemsPerPage,
                    minPrice: filters.priceRange[0],
                    maxPrice: filters.priceRange[1],
                });

                if (selectedCategories.length > 0) {
                    queryParams.append('categories', selectedCategories);
                }

                const response = await fetch(`http://localhost:3000/products?${queryParams}`);
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters, page]);

    const handleItems = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
        setPage(1);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setTempPriceRange(newValue);
    };

    const handlePriceRangeCommitted = (event, newValue) => {
        setFilters({ ...filters, priceRange: newValue });
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    if (error)
        return (
            <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
                Error: {error}
            </Typography>
        );

    return (
        <Box maxWidth="100%" sx={{ display: "flex", mt: 4 }}>
            <Box sx={{ width: "25%" }}>
                <Paper sx={{ width: "90%", p: 3, height: "fit-content", position: "sticky", top: 10, left: 0 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox name="electronics" checked={filters.electronics} onChange={handleItems} />} label="Electronics" />
                        <FormControlLabel control={<Checkbox name="household" checked={filters.household} onChange={handleItems} />} label="Household Essentials" />
                        <FormControlLabel control={<Checkbox name="fashion" checked={filters.fashion} onChange={handleItems} />} label="Fashion" />
                        <FormControlLabel control={<Checkbox name="beauty" checked={filters.beauty} onChange={handleItems} />} label="Health and Beauty" />
                    </FormGroup>
                    <Typography variant="body1" sx={{ mt: 3 }}>Price Range</Typography>
                    <Slider
                        value={tempPriceRange}
                        onChange={handlePriceRangeChange}
                        onChangeCommitted={handlePriceRangeCommitted}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100000}
                        sx={{ width: '90%', mt: 1 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        ${tempPriceRange[0]} - ${tempPriceRange[1]}
                    </Typography>
                </Paper>
            </Box>
            <Box sx={{ flexGrow: 1, ml: 5 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {products.map((product) => (
                        <Box
                            key={product.id}
                            sx={{
                                padding: 1,
                                m: 1
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
                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}