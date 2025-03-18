import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { decreaseCart, increaseCart, calculateTotalQuantity, removeFromCart } from '../../redux/slice/cartSlice'

function CartCard({ name, url, price, id, qty }) {
    const dispatch = useDispatch()
    const truncateText = (text) => {
        return text[0].toUpperCase() + text.substr(1)
    };

    const handleDecrement = () => {
        dispatch(decreaseCart({ id }))
        dispatch(calculateTotalQuantity());
    }
    const handleIncrement = () => {
        dispatch(increaseCart({ id }))
        dispatch(calculateTotalQuantity());
    }
    const handleDelete = (id) => {
        dispatch(removeFromCart({ id }))
        dispatch(calculateTotalQuantity());
    }

    return (
        <Card sx={{ width: "100%", boxShadow: 2, display: "flex", flexDirection: "row", alignItems: "center", padding: 2, height: 160 }}>
            <CardMedia sx={{ width: "10%", height: '100%', objectFit: "cover" }} image={url} title={name} />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 300, overflow: 'auto' }}>
                <Typography gutterBottom variant="h10" component="div">
                    {truncateText(name.toLowerCase())}
                </Typography>
                <Typography variant='h10' gutterBottom>
                    <IconButton sx={{ color: "orange" }} onClick={handleDecrement}><RemoveIcon /></IconButton>
                    {qty}
                    <IconButton sx={{ color: "#7BA9FFFF" }} onClick={handleIncrement}>
                        <AddIcon />
                    </IconButton>
                </Typography>
                <Typography variant="h10" sx={{ marginTop: 1 }}>
                    Price: ${price}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: "100%" }}>

                <IconButton onClick={() => handleDelete(id)} color="gray">
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default CartCard;