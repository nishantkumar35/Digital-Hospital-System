import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', stockQuantity: '' });
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => { loadMedicines(); }, []);

    const loadMedicines = async () => {
        try { setMedicines(await api.getMedicines()); } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) await api.updateMedicine(isEditing, form);
            else await api.createMedicine(form);
            setForm({ name: '', description: '', price: '', stockQuantity: '' });
            setIsEditing(null);
            loadMedicines();
        } catch (e) { alert("Failed"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete medicine?")) {
            await api.deleteMedicine(id);
            loadMedicines();
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="page-header">
                <h2 className="page-title">Pharmacy Inventory</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>{isEditing ? 'Update Stock' : 'Add Medicine'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <input className="input-field" placeholder="Medicine Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input className="input-field" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                    <input className="input-field" type="number" step="0.01" placeholder="Price ($)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    <input className="input-field" type="number" placeholder="Stock Quantity" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} required />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
                        {isEditing && <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(null); setForm({ name: '', description: '', price: '', stockQuantity: '' }); }}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="grid-cards">
                {medicines.map(m => (
                    <div key={m.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{m.name}</h3>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#22c55e' }}>${m.price}</div>
                        </div>
                        <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>{m.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <div style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: m.stockQuantity < 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: m.stockQuantity < 10 ? '#ef4444' : '#22c55e', fontSize: '0.875rem', fontWeight: '600' }}>
                                Stock: {m.stockQuantity}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => { setForm(m); setIsEditing(m.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                                <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(m.id)}>Del</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Medicines;
