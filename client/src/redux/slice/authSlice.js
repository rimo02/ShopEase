import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { login as loginApi } from './AuthApi'
import { signup as signupApi } from './AuthApi'
import { forgetpassword as forgetApi } from './AuthApi'
import { resetpassword as resetApi } from './AuthApi'
import { jwtDecode } from "jwt-decode";

const storedToken = localStorage.getItem("token");

let isValidToken = false;
if (storedToken) {
    try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now();
        isValidToken = decodedToken.exp * 1000 > currentTime;
    } catch (error) {
        console.error("Invalid token", error);
    }
}

const storedUser = isValidToken ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
    isUserLoggedIn: isValidToken,
    email: storedUser?.email || null,
    username: storedUser?.username || null,
    userId: storedUser?.userId || null,
    role: storedUser?.role || "user",
    token: isValidToken ? storedToken : null,
    status: 'idle',
    error: null
};

export const signupAsync = createAsyncThunk('/auth/signup', async ({ email, username, password }, { rejectWithValue }) => {
    try {
        console.log(email, username, password)
        const res = await signupApi({ email, username, password });
        return res;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Signup failed');
    }
})

export const loginAsync = createAsyncThunk('/auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await loginApi({ email, password });
        return res;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
})

export const forgetAsync = createAsyncThunk('/auth/forget', async ({ email }, { rejectWithValue }) => {
    try {
        const res = await forgetApi({ email });
        return res;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Forget Password failed');
    }
})

export const resetAsync = createAsyncThunk('/auth/reset', async ({ email, password, otp }, { rejectWithValue }) => {
    try {
        const res = await resetApi({ email, password, otp });
        return res;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Reset Password failed');
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isUserLoggedIn = false
            state.email = null
            state.username = null
            state.userId = null
            state.error = null
            state.token = null
            state.role = null
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isUserLoggedIn = true;
                state.email = action.payload.user.email;
                state.userId = action.payload.user._id;
                state.username = action.payload.user.username?.split(' ')[0] || null;
                state.token = action.payload.token
                state.role = action.payload.user.role

                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify({
                    email: action.payload.user.email,
                    userId: action.payload.user._id,
                    username: action.payload.user.username?.split(' ')[0] || null,
                    role: action.payload.user.role
                }));
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(signupAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isUserLoggedIn = true;
                state.email = action.payload.user.email;
                state.userId = action.payload.user._id;
                state.username = action.payload.user.username?.split(' ')[0] || null;
                state.token = action.payload.token
                state.role = action.payload.user.role

                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify({
                    email: action.payload.user.email,
                    userId: action.payload.user._id,
                    username: action.payload.user.username?.split(' ')[0] || null,
                    role: action.payload.user.role
                }));
            })
            .addCase(signupAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(forgetAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(forgetAsync.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(forgetAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(resetAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(resetAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isUserLoggedIn = true;
                state.email = action.payload.user.email;
                state.userId = action.payload.user._id;
                state.username = action.payload.user.username?.split(' ')[0] || null;
            })
            .addCase(resetAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
})

export const { setActiveUser, setInactiveUser } = authSlice.actions
export default authSlice.reducer