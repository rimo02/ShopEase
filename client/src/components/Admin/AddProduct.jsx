import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, FormGroup, FormControlLabel, Checkbox, Grid } from '@mui/material';
import axios from 'axios';

function AddProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);

    const handleCategoryChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setCategories([...categories, name]);
        } else {
            setCategories(categories.filter(category => category !== name));
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!name || !price || !image) {
            alert("Please fill all required fields.");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("image", image);
        formData.append("categories", JSON.stringify(categories));

        try {
            await axios.post("http://localhost:3000/add-product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Product added successfully!");
            setName("");
            setDescription("");
            setPrice(0);
            setDiscount(0);
            setImage(null);
            setCategories([]);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            maxWidth: '100%',
            overflowX: 'hidden',
        }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: 1,
                    textAlign: 'center',
                }}
            >
                <Typography variant='h4'>Add Product</Typography>
                <Grid container spacing={0.5}>
                    <Grid item xs={12}>
                        <TextField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} fullWidth margin="normal" />
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox name="electronics" checked={categories.includes("electronics")} onChange={handleCategoryChange} />} label="Electronics" />
                            <FormControlLabel control={<Checkbox name="household" checked={categories.includes("household")} onChange={handleCategoryChange} />} label="Household Essentials" />
                            <FormControlLabel control={<Checkbox name="fashion" checked={categories.includes("fashion")} onChange={handleCategoryChange} />} label="Fashion" />
                            <FormControlLabel control={<Checkbox name="beauty" checked={categories.includes("beauty")} onChange={handleCategoryChange} />} label="Health and Beauty" />
                            <FormControlLabel control={<Checkbox name="clothing" checked={categories.includes("clothing")} onChange={handleCategoryChange} />} label="Clothing" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6}>
                        <input type="file" accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" onClick={handleAddProduct} fullWidth>
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default AddProduct;