//list of chairs with sorting and filtering

import { useEffect, useState } from 'react';
import './Dashboard.css';
function ItemList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        quantity: 0,
        status: ''
    });

    const [sortKey, setSortKey] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchItems = () => {
        setLoading(true);
        fetch('http://127.0.0.1:8001/items')
            .then((res) => {
                if (!res.ok) throw new Error('Data fetch failed');
                return res.json();
            })
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete the product?')) return;

        try {
            const res = await fetch(`http://127.0.0.1:8001/items/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Deleting error');
            fetchItems();
        } catch (err) {
            alert('Deleting error');
            console.error(err);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            status: item.status,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://127.0.0.1:8001/items/${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('Editing error');
            setEditingItem(null);
            fetchItems();
        } catch (err) {
            alert('Editing error');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const getArrow = (key) => {
        if (sortKey !== key) return '⬍';
        return sortOrder === 'asc' ? '⬆' : '⬇';
    };

    const filteredItems = items.filter(item => {
        const categoryMatch = filterCategory
            ? item.category?.toLowerCase().trim() === filterCategory.toLowerCase()
            : true;

        const statusMatch = filterStatus
            ? item.status?.toLowerCase().trim() === filterStatus.toLowerCase()
            : true;

        return categoryMatch && statusMatch;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (sortKey.includes('date')) {
            const dateA = new Date(valA);
            const dateB = new Date(valB);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }

        if (typeof valA === 'number') {
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        return sortOrder === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <label>
                    Category:&nbsp;
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="">All</option>
                        <option value="metal">Metal</option>
                        <option value="plastic">Plastic</option>
                        <option value="wood">Wood</option>
                    </select>
                </label>
                <label>
                    Status:&nbsp;
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="available">Available</option>
                        <option value="low stock">Low Stock</option>
                        <option value="out of stock">Out of Stock</option>
                    </select>
                </label>
            </div>

            <table>
                <thead>
                <tr>
                    <th onClick={() => handleSort('name')}>Name {getArrow('name')}</th>
                    <th onClick={() => handleSort('description')}>Description {getArrow('description')}</th>
                    <th onClick={() => handleSort('category')}>Category {getArrow('category')}</th>
                    <th onClick={() => handleSort('quantity')}>Quantity {getArrow('quantity')}</th>
                    <th onClick={() => handleSort('status')}>Status {getArrow('status')}</th>
                    <th onClick={() => handleSort('date_added')}>Date Added {getArrow('date_added')}</th>
                    <th onClick={() => handleSort('date_updated')}>Date Updated {getArrow('date_updated')}</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{item.status}</td>
                        <td>{item.date_added ? new Date(item.date_added).toLocaleDateString() : '-'}</td>
                        <td>{item.date_updated ? new Date(item.date_updated).toLocaleDateString() : '-'}</td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEditClick(item)}>Edit</button>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {editingItem && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <h3>Editing product: {editingItem.name}</h3>
                        <form onSubmit={handleSave}>
                            <label>
                                Name:
                                <input name="name" value={formData.name} onChange={handleChange} required />
                            </label><br />
                            <label>
                                Description:
                                <input name="description" value={formData.description} onChange={handleChange} />
                            </label><br />
                            <label>
                                Category:
                                <input name="category" value={formData.category} onChange={handleChange} />
                            </label><br />
                            <label>
                                Quantity:
                                <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} min={0} />
                            </label><br />
                            <label>
                                Status:
                                <input name="status" value={formData.status} onChange={handleChange} />
                            </label><br />
                            <button type="submit">Save</button>
                            <button type="button" onClick={handleCancel} >Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',

    }
};

export default ItemList;
