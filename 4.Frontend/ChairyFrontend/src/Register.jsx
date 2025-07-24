import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logreg.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Account creating error');
            }

            alert('Account created successfully!');
            navigate('/');
        } catch (err) {
            alert('Account creating error');
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
            <form onSubmit={handleRegister}>
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
                <button type="submit">Create Account</button>
            </form>
            <button onClick={() => navigate('/')}>Back</button>
        </div>
    );
}

export default Register;
