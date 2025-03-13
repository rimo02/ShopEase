import axios from 'axios'

export const signup = async ({ email, username, password }) => {
    try {
        console.log(email, username, password)
        const res = await axios.post('http://localhost:3000/api/signup', { email, username, password })
        return res.data
    } catch (error) {
        throw error.error
    }
}
export const login = async ({ email, password }) => {
    try {
        const res = await axios.post('http://localhost:3000/api/login', { email, password })
        return res.data
    } catch (error) {
        throw error.error
    }
}
export const forgetpassword = async ({ email }) => {
    try {
        const res = await axios.post('http://localhost:3000/api/forget', { email })
        return res.data
    } catch (error) {
        throw error.error
    }
}
export const resetpassword = async ({ email, password, otp }) => {
    try {
        const res = await axios.post('http://localhost:3000/api/reset', { email, password, otp })
        return res.data
    } catch (error) {
        throw error.error
    }
}