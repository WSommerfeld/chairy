import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logreg.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch('http://127.0.0.1:8001/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            setToken(data.access_token);
            localStorage.setItem('token', data.access_token);
            //alert('Logged in!');
            navigate('/dashboard'); // go to dashboard
        } catch (err) {
            alert('Incorrect e-mail or password');
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <img
                    src="/chairy.png"
                    alt="Logo"
                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
                <h1 style={{ margin: 0 }}>Chairy</h1>
            </div>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="e-mail address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log in</button>
            </form>
            <button onClick={() => navigate('/register')}>Sign up</button>

            {token}
        </div>
    );
}

export default Login;
