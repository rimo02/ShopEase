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
import { toast, ToastContainer } from 'react-toastify';
import { calculateTotalQuantity } from '../../redux/slice/cartSlice'

export default function MediaCard({ name, description, url, discount, price, categories, id }) {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const dispatch = useDispatch()
    const isMediumScreen = useMediaQuery('(max-width:2200px)');
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
            autoClose: 1000,
            theme: "light"
        });
    };

    return (
        <Card sx={{ width: 260, height: 380, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
            <CardMedia sx={{ height: 160 }} image={url} title={name} />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h5" component="h1">
                    {truncateText(name.toLowerCase(), nameLimit)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {truncateText(description.toLowerCase(), descLimit)}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Price: ${price} {discount && <span style={{ color: 'orange' }}>({discount}% off)</span>}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    {console.log(categories)}
                    <strong>Categories</strong>: {categories.join(", ")}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button size="small" onClick={addtoCart}>Add to Cart</Button>
                <Button size="small">View Details</Button>
                <ToastContainer />
            </CardActions>
        </Card>
    );
}
