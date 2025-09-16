import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { dotStream } from "ldrs";
dotStream.register();
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <ToastContainer />
    {/* ✅ Render the main App component */}
    <Toaster position="top-right" reverseOrder={false} />
    {/* ✅ Render the main App component */}
    <App />
    <Toaster position="top-right" reverseOrder={false} />
  </Provider>
  </StrictMode>,
)
