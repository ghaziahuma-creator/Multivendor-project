import React from 'react';
import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {SignupPage,LoginPage,ActivationPage} from "./Routes.js";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/sign-up' element={<SignupPage/>} />
      <Route path='/activation/:activation_token' element={<ActivationPage/>} /> 
    </Routes>
    <ToastContainer 
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    >

    </ToastContainer>
    </BrowserRouter>
  )
}

export default App