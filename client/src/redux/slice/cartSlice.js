import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    totalQuantity: 0,
    totalPrice: 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {

            const existingIndex = state.cartItems.findIndex((item) => item.id === action.payload.id)
            if (existingIndex != -1) {
                state.cartItems[existingIndex] = {
                    ...state.cartItems[existingIndex],
                    qty: state.cartItems[existingIndex].qty + 1
                };
            } else {
                const temp = { ...action.payload, qty: 1 }
                state.cartItems.push(temp)
            }
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        decreaseCart: (state, action) => {
            const index = state.cartItems.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                if (state.cartItems[index].qty === 1) {
                    state.cartItems.splice(index, 1);
                } else {
                    state.cartItems[index] = {
                        ...state.cartItems[index],
                        qty: state.cartItems[index].qty - 1
                    };
                }
            }
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        increaseCart: (state, action) => {
            const index = state.cartItems.findIndex((item) => item.id === action.payload.id)
            if (index !== -1) {
                state.cartItems[index] = {
                    ...state.cartItems[index],
                    qty: state.cartItems[index].qty + 1,
                }
            }

        },
        removeFromCart: (state, action) => {
            const newCart = state.cartItems.filter((item) => item.id !== action.payload.id)
            state.cartItems = newCart
            localStorage.setItem("cart", JSON.stringify(state.cartItems))
        },
        clearCart: (state) => {
            state.cartItems = []
            state.totalQuantity = 0
            state.totalPrice = 0
            localStorage.removeItem("cart");  
        },
        calculateTotalPrice: (state) => {
            state.totalPrice = state.cartItems.reduce((total, item) => {
                const { price, qty } = item;
                return total + price * qty;
            }, 0);
        },
        calculateTotalQuantity: (state) => {
            state.totalQuantity = state.cartItems.reduce((total, item) => {
                const { qty } = item
                return total + qty
            }, 0)
        }
    }
})

export const {
    addToCart,
    decreaseCart,
    calculateTotalPrice,
    removeFromCart,
    clearCart,
    calculateTotalQuantity,
    increaseCart
} = cartSlice.actions
export default cartSlice.reducer