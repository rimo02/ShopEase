import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetAsync as reset } from "../../redux/slice/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return;
        }
        dispatch(reset({ email, otp, password })).then((res) => {
            if (!res.error) {
                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            } else {
                console.log(res.payload || "Password Reset Failed");
            }
        });
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <IconButton onClick={() => navigate("/home")} sx={{ alignSelf: "flex-start" }}>
                    <ArrowBackIcon />
                </IconButton>

                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Reset Password
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Retype Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Reset Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default ResetPassword;