import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemList from './ItemList';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('list');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        quantity: 0,
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Number(value) : value
        }));
    };

    const calculateStatus = (quantity) => {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 10) return 'Low Stock';
        return 'Available';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newItem = {
            ...formData,
            status: calculateStatus(formData.quantity),
        };

        try {
            const res = await fetch('http://127.0.0.1:8001/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) throw new Error('Product adding failed');

            setFormData({
                name: '',
                description: '',
                category: '',
                quantity: 0,
            });
            setMessage('Product added successfully');
        } catch (err) {
            console.error(err);
            setMessage('Product adding failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="dashboard" style={{ padding: '20px', minHeight: '100vh' }}>

            {/* Logo, title and logout button*/}
            <header >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                    <img
                        src="/chairy.png"
                        alt="Logo"
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    />
                    <h1 style={{ margin: 0 }}>Chairy</h1>
                </div>


                <div style={{ flexShrink: 0 }}>
                    <button
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Tab bar */}
            <div className="tab-bar">
                <button
                    className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    List
                </button>
                <button
                    className={`tab ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add product
                </button>
            </div>

            {/* Tab content */}
            <div className="tab-content">
                {activeTab === 'list' && <ItemList />}

                {/* Adding form */}
                {activeTab === 'add' && (
                    <div className="add-form-container">
                        <h2>New product</h2>
                        {message && <p>{message}</p>}
                        <form onSubmit={handleSubmit}>
                            <label>
                                Name:
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <br />
                            <label>
                                Description:
                                <input
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </label>
                            <br />
                            <label>
                                Category:
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Choose --</option>
                                    <option value="Wood">Wood</option>
                                    <option value="Plastic">Plastic</option>
                                    <option value="Metal">Metal</option>
                                </select>
                            </label>
                            <br />
                            <label>
                                Quantity:
                                <input
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min={0}
                                    required
                                />
                            </label>
                            <br />
                            <button type="submit">Add product</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
