import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="dashboard" element={<Dashboard />}></Route>
      </Routes>
    </div>
  );
};

export default App;
