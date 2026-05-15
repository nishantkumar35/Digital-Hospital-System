import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const Receipts = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([]);

    // Create Form State
    const [form, setForm] = useState({ patientId: '', disease: '', symptoms: '', remedy: '' });
    const [cart, setCart] = useState([]);
    const [currentMed, setCurrentMed] = useState({ medicineId: '', quantity: 1 });

    // View State
    const [searchPatientId, setSearchPatientId] = useState('');
    const [receiptsList, setReceiptsList] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [p, m] = await Promise.all([api.getPatients(), api.getMedicines()]);
            setPatients(p);
            setMedicines(m);
        } catch (e) { console.error(e); }
    };

    const addToCart = () => {
        if (!currentMed.medicineId || currentMed.quantity <= 0) return;
        const med = medicines.find(m => m.id === parseInt(currentMed.medicineId));
        setCart([...cart, { ...med, quantity: parseInt(currentMed.quantity) }]);
        setCurrentMed({ medicineId: '', quantity: 1 });
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (cart.length === 0) { alert("Add at least one medicine"); return; }

        const payload = {
            patientId: parseInt(form.patientId),
            disease: form.disease,
            symptoms: form.symptoms,
            remedy: form.remedy,
            medicines: cart.map(item => ({ medicineId: item.id, quantity: item.quantity }))
        };

        try {
            const receipt = await api.createReceipt(payload);
            alert(`Receipt Generated! Total: $${ receipt.totalAmount }`);
            setForm({ patientId: '', disease: '', symptoms: '', remedy: '' });
            setCart([]);
            // Switch to view and show this receipt? Or just stay.
        } catch (e) {
            console.error(e);
            alert("Failed to generate receipt");
        }
    };

    const searchReceipts = async () => {
        if (!searchPatientId) return;
        try {
            const data = await api.getReceiptsByPatient(searchPatientId);
            setReceiptsList(data);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="container animate-fade-in">
            <div className="page-header">
                <h2 className="page-title">Receipts & Billing</h2>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className={`btn ${ activeTab === 'create' ? 'btn-primary' : 'btn-secondary' }`} onClick={() => setActiveTab('create')}>Create New</button>
                <button className={`btn ${ activeTab === 'view' ? 'btn-primary' : 'btn-secondary' }`} onClick={() => setActiveTab('view')}>View History</button>
            </div>

            {activeTab === 'create' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <form onSubmit={handleCreate}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3 style={{ color: '#94a3b8' }}>Patient Details</h3>
                                <select className="input-field" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required>
                                    <option value="">Select Patient</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
                                </select>
                                <input className="input-field" placeholder="Disease" value={form.disease} onChange={e => setForm({ ...form, disease: e.target.value })} required />
                                <input className="input-field" placeholder="Symptoms" value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} required />
                                <textarea className="input-field" placeholder="Remedy / Notes" value={form.remedy} onChange={e => setForm({ ...form, remedy: e.target.value })} rows="3" required />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3 style={{ color: '#94a3b8' }}>Prescription</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select className="input-field" value={currentMed.medicineId} onChange={e => setCurrentMed({ ...currentMed, medicineId: e.target.value })}>
                                        <option value="">Select Medicine</option>
                                        {medicines.map(m => <option key={m.id} value={m.id}>{m.name} (${m.price})</option>)}
                                    </select>
                                    <input type="number" className="input-field" style={{ width: '80px' }} value={currentMed.quantity} onChange={e => setCurrentMed({ ...currentMed, quantity: e.target.value })} min="1" />
                                    <button type="button" className="btn btn-secondary" onClick={addToCart}>Add</button>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', minHeight: '200px' }}>
                                    {cart.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #334155' }}>
                                            <span>{item.name} x {item.quantity}</span>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                <span style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => removeFromCart(idx)}>×</span>
                                            </div>
                                        </div>
                                    ))}
                                    {cart.length > 0 && (
                                        <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem', color: '#22c55e' }}>
                                            Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>Generate Receipt</button>
                    </form>
                </div>
            )}

            {activeTab === 'view' && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <select className="input-field" value={searchPatientId} onChange={e => setSearchPatientId(e.target.value)} style={{ maxWidth: '300px' }}>
                            <option value="">Select Patient to View History</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button className="btn btn-primary" onClick={searchReceipts}>Search</button>
                    </div>

                    <div className="grid-cards">
                        {receiptsList.map(r => (
                            <div key={r.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: '#94a3b8' }}>#{r.id} • {new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                                    <span style={{ fontWeight: 'bold', color: '#22c55e' }}>${r.totalAmount}</span>
                                </div>
                                <p><strong>Disease:</strong> {r.disease}</p>
                                <p><strong>Symptoms:</strong> {r.symptoms}</p>
                                <div style={{ marginTop: '1rem' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Medicines:</p>
                                    {r.medicines.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span>{m.medicineName} x {m.quantity}</span>
                                            <span>${(m.priceAtPurchase * m.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {receiptsList.length === 0 && searchPatientId && (
                            <p style={{ color: '#94a3b8' }}>No receipts found for this patient.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Receipts;
