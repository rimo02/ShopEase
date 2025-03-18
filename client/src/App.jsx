import './App.css'
import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import LoginPage from './pages/Auth/LoginPage'
import SignupPage from './pages/Auth/SignupPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import { Provider } from 'react-redux'
import { store } from '../src/redux/store'
import { RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Admin from './pages/Admin/Admin'
import { useEffect } from 'react'
import { useNavigate,Navigate } from 'react-router-dom'
import Cart from './components/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'

const ProtectedRoute = ({ children }) => {
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);
  return isUserLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  const { isUserLoggedIn, role } = useSelector((state) => state.auth)
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoggedIn || role !== "admin") {
      navigate(isUserLoggedIn ? "/" : "/login", { replace: true });
    }
  }, [isUserLoggedIn, role, navigate]);

  return isUserLoggedIn && role === "admin" ? children : <Navigate to="/" replace />;

}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: < Home /> },
      { path: "/login", element: < LoginPage /> },
      { path: "/signup", element: < SignupPage /> },
      { path: "forgot", element: < ForgotPasswordPage /> },
      { path: "/reset", element: < ResetPasswordPage /> },
      {
        path: "/admin",
        element: (
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        )
      },
      {
        path: "/cart", element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      {
        path: "/checkout", element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        )
      }

    ]
  }
])

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
