import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import Landing from "./pages/Landing/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutSuccess from "./components/Dashboard/CheckoutSuccess";
import NotFound from "./components/Dashboard/NotFound";
import TestTree from "./components/Test/App";
import Test from "./special/test";
import ForgetPassword from "./pages/ForgetPassword";

function RedirectToDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    let authToken = sessionStorage.getItem("Auth Token");
    if (authToken) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return null;
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/test"
            element={
              <>
                <Test />
              </>
            }
          />
          <Route
            path="/resetpassword"
            element={
              <>
                <ForgetPassword />
              </>
            }
          />
          {/* <Route
            path="/"
            element={
              <>
                <RedirectToDashboard />
                <Landing />
              </>
            }
          /> */}
          <Route
            path="/checkout-success"
            element={
              <>
                <CheckoutSuccess />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <RedirectToDashboard />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <RedirectToDashboard />
                <Register />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <>
                <NotFound />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
