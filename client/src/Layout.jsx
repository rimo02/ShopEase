import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Box } from '@mui/material';


function Layout() {
    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowX: 'hidden',
                bgcolor:"#EDEDEDFF"
            }}
        >
            <Header />
            <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', justifyContent: 'center', }}>
                <Outlet />
            </Box>
            <Footer />
        </Box>
    );
}
export default Layout;
