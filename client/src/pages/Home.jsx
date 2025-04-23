import React, { useEffect, useState, useCallback, useContext } from 'react';
import { CircularProgress, Typography, Pagination, Box, Paper, FormGroup, FormControlLabel, Checkbox, Slider } from '@mui/material';
import MediaCard from '../components/Items/MediaCard';
import debounce from 'lodash.debounce';
import { useLocation } from 'react-router-dom'
import { FilterContext } from '../context/FilterContext';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const searchQuery = searchParams.get('search') || "";
    const { filters } = useContext(FilterContext)

    const fetchedProducts = useCallback(
        debounce(async (filters, page, searchQuery) => {
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
                    search: searchQuery
                });

                if (selectedCategories.length > 0) {
                    queryParams.append('categories', selectedCategories);
                }

                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/products?${queryParams}`);
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                setProducts(data.products);
                console.log(products)
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 500), []);

    useEffect(() => {
        fetchedProducts(filters, page, searchQuery);
    }, [filters, page, fetchedProducts, searchQuery]);

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
        <Box maxWidth="100%" sx={{ display: "flex", p: 4 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{
                    display: "flex", flexWrap: "wrap",
                    gap: 4,
                    justifyContent:"center"
                }}>
                    {products.map((product) => (
                        <Box sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <MediaCard
                                key={product.id}
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