import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material'
import { addToCart } from '../../redux/slice/cartSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import {calculateTotalQuantity} from '../../redux/slice/cartSlice' 

export default function MediaCard({ name, description, url, discount, price, categories, id }) {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isMediumScreen = useMediaQuery('(max-width:2200px)');
    const dispatch = useDispatch()
    let nameLimit = isSmallScreen ? 15 : isMediumScreen ? 20 : 25;
    let descLimit = isSmallScreen ? 20 : isMediumScreen ? 30 : 40;

    const truncateText = (text, maxLength) => {
        text = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        text = text[0].toUpperCase() + text.substr(1)
        return text
    };

    const addtoCart = () => {
        dispatch(addToCart({ name, description, url, discount, price, categories, id }));
        dispatch(calculateTotalQuantity());
        toast.success("Item Added to Cart!", {
            position: "top-right",
            autoClose: 3000,
            theme: "light"
        });
    };

    return (
        <Card sx={{ maxWidth: 285, maxHeight: '100%', boxShadow: 2 }}>
            <CardMedia
                sx={{ height: 160 }}
                image={url}
                title={name}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Typography gutterBottom variant="h5" component="div">
                    {truncateText(name.toLowerCase(), nameLimit)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {truncateText(description.toLowerCase(), descLimit)}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Price: ${price} {discount && <span style={{ color: 'orange' }}>({discount}% off)</span>}
                </Typography>
                <Typography variant="h10    " sx={{ marginTop: 2 }}>
                    <strong>Categories</strong>: {categories.join(" ")}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={addtoCart}>Add to Cart</Button>
                <Button size="small">View Details</Button>
            </CardActions>
        </Card>
    );
}
