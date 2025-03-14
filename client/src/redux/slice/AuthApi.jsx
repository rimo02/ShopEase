import axios from 'axios'

export const signup = async ({ email, username, password }) => {
    try {
        console.log(email, username, password)
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}api/signup`, { email, username, password })
        return res.data
    } catch (error) {
        throw error.error
    }
}
export const login = async ({ email, password }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/login`, { email, password })
        return res.data
    } catch (error) {
        throw error.error
    }
}
export const forgetpassword = async ({ email }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}api/forget`, { email })
        return res.data
    } catch (error) {
        throw error.error
    }
}
export const resetpassword = async ({ email, password, otp }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/reset`, { email, password, otp })
        return res.data
    } catch (error) {
        throw error.error
    }
}