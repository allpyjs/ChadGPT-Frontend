import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  return sessionStorage.getItem("Auth Token") ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
