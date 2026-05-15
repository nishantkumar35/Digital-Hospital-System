import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ name: '', age: '', gender: '', phone: '', address: '', assignedDoctorId: '' });
    const [isEditing, setIsEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [patientsData, doctorsData] = await Promise.all([
                api.getPatients(),
                api.getDoctors()
            ]);
            setPatients(patientsData);
            setDoctors(doctorsData);
        } catch (error) {
            console.error("Failed to load data", error);
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
            const payload = { ...form, assignedDoctorId: form.assignedDoctorId ? parseInt(form.assignedDoctorId) : null };
            if (isEditing) {
                await api.updatePatient(isEditing, payload);
            } else {
                await api.createPatient(payload);
            }
            setForm({ name: '', age: '', gender: '', phone: '', address: '', assignedDoctorId: '' });
            setIsEditing(null);
            loadData();
        } catch (error) {
            console.error("Operation failed", error);
            alert("Operation failed");
        }
    };

    const handleEdit = (patient) => {
        setForm({
            ...patient,
            assignedDoctorId: patient.assignedDoctorId || ''
        });
        setIsEditing(patient.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.deletePatient(id);
            loadData();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="container animate-fade-in">
            <div className="page-header">
                <h2 className="page-title">Patients Directory</h2>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>{isEditing ? 'Edit Patient' : 'Register Patient'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Name</label>
                        <input className="input-field" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Age</label>
                        <input type="number" className="input-field" name="age" value={form.age} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Gender</label>
                        <select className="input-field" name="gender" value={form.gender} onChange={handleChange} required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Phone</label>
                        <input className="input-field" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Address</label>
                        <input className="input-field" name="address" value={form.address} onChange={handleChange} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Assigned Doctor</label>
                        <select className="input-field" name="assignedDoctorId" value={form.assignedDoctorId} onChange={handleChange}>
                            <option value="">None</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>{isEditing ? 'Update' : 'Register'}</button>
                        {isEditing && (
                            <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(null); setForm({ name: '', age: '', gender: '', phone: '', address: '', assignedDoctorId: '' }); }}>Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age/Gender</th>
                            <th>Contact</th>
                            <th>Doctor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 500 }}>{p.name}</td>
                                <td style={{ color: '#94a3b8' }}>{p.age} / {p.gender}</td>
                                <td style={{ color: '#94a3b8' }}>
                                    <div>{p.phone}</div>
                                    <div style={{ fontSize: '0.75rem' }}>{p.address}</div>
                                </td>
                                <td>
                                    {p.assignedDoctorName ? (
                                        <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.875rem' }}>
                                            {p.assignedDoctorName}
                                        </span>
                                    ) : <span style={{ color: '#64748b' }}>Unassigned</span>}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleEdit(p)}>Edit</button>
                                        <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(p.id)}>Del</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No patients found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patients;
