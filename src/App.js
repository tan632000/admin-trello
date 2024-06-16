import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import UserManagement from './components/UserManagement';
import TaskManagement from './components/TaskManagement';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('is_admin') === 'true');
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    setIsLoggedIn(isAdmin);
  }, []);

  useEffect(() => {
    if (isLoggedIn && !redirected) {
      setRedirected(true);
    }
  }, [isLoggedIn, redirected]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('is_admin', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('is_admin');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <div>
        {isLoggedIn && (
          <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/users">Users</Nav.Link>
                <Nav.Link as={Link} to="/tasks">Tasks</Nav.Link>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        )}
        <Routes>
          <Route path="/users" element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={isLoggedIn ? <TaskManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
