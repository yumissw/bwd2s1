import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Events from "./pages/events/Events";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import React, { useEffect } from "react";
import { useAppDispatch } from "./app/hooks"; // Assuming you have this set up
import { initializeAuthFromLocalStorage } from "./features/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuthFromLocalStorage());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
