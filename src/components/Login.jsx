import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Login.css';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('is_admin') === 'true') {
            navigate('/dashboard');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const response = await axios.post('http://34.142.249.60/admin/login', {
                username,
                password
            });

            const data = response.data;
            if (data && data.userId && data.userId.Role === 'admin') {
                localStorage.setItem('userId', data.userId.userId);
                localStorage.setItem('is_admin', 'true');
                onLogin();
                navigate('/dashboard');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
