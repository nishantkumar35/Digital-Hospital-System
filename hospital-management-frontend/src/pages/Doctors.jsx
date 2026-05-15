import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ name: '', specialization: '', phone: '', email: '' });
    const [isEditing, setIsEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const data = await api.getDoctors();
            setDoctors(data);
        } catch (error) {
            console.error("Failed to load doctors", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.updateDoctor(isEditing, form);
            } else {
                await api.createDoctor(form);
            }
            setForm({ name: '', specialization: '', phone: '', email: '' });
            setIsEditing(null);
            loadDoctors();
        } catch (error) {
            console.error("Operation failed", error);
            alert("Operation failed");
        }
    };

    const handleEdit = (doctor) => {
        setForm(doctor);
        setIsEditing(doctor.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.deleteDoctor(id);
            loadDoctors();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="page-header">
                <h2 className="page-title">Doctors Management</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Name</label>
                        <input className="input-field" name="name" placeholder="Dr. John Doe" value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Specialization</label>
                        <input className="input-field" name="specialization" placeholder="Cardiology" value={form.specialization} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Phone</label>
                        <input className="input-field" name="phone" placeholder="+1 234..." value={form.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Email</label>
                        <input className="input-field" name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update' : 'Create'}</button>
                        {isEditing && (
                            <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(null); setForm({ name: '', specialization: '', phone: '', email: '' }); }}>Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : (
                <div className="grid-cards">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '1.25rem' }}>
                                    Dr
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleEdit(doctor)}>Edit</button>
                                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(doctor.id)}>Del</button>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{doctor.name}</h3>
                            <p style={{ color: '#3b82f6', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>{doctor.specialization}</p>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <p>📞 {doctor.phone}</p>
                                <p>✉️ {doctor.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctors;
