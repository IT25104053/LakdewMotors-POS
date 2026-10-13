import { useState } from 'react';
import axios from 'axios';

export default function CustomersTab({ currentUser, customerForm, setCustomerForm, handleCustomerSubmit, customers, fetchData, showToast }) {
    const [editingRows, setEditingRows] = useState({});

    const handleEditClick = (customer) => {
        setEditingRows(prev => ({
            ...prev,
            [customer.customerId]: { name: customer.name, phone: customer.phone }
        }));
    };

    const handleCancelClick = (customerId) => {
        setEditingRows(prev => {
            const copy = { ...prev };
            delete copy[customerId];
            return copy;
        });
    };

    const handleInputChange = (customerId, field, value) => {
        setEditingRows(prev => ({
            ...prev,
            [customerId]: { ...prev[customerId], [field]: value }
        }));
    };

    const handleSaveCustomer = (customer) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        const edits = editingRows[customer.customerId];
        if (!edits.name.trim() || !edits.phone.trim()) {
            showToast('Validation Error: Fields cannot be empty.', 'error');
            return;
        }

        const payload = {
            ...customer,
            name: edits.name,
            phone: edits.phone
        };

        axios.put(`http://localhost:8080/api/customers/${customer.customerId}`, payload)
            .then(() => {
                showToast('Customer updated successfully!', 'success');
                handleCancelClick(customer.customerId);
                if (fetchData) fetchData();
            })
            .catch(() => showToast('Failed to update customer.', 'error'));
    };

    const handleDeleteCustomer = (customerId, name) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to permanently delete customer: ${name}?`)) {
            axios.delete(`http://localhost:8080/api/customers/${customerId}`)
                .then(() => {
                    showToast('Customer deleted successfully.', 'success');
                    if (fetchData) fetchData();
                })
                .catch(() => showToast('Failed to delete customer.', 'error'));
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

            {/* Left Column: Register Customer Form */}
            <section className="glass-panel" style={{ height: 'fit-content' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Register Customer</h3>
                <form onSubmit={handleCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={customerForm.name}
                        onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                        className="glass-input"
                    />
                    <input
                        type="text"
                        placeholder="Phone (10 digits)"
                        required
                        value={customerForm.phone}
                        onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                        className="glass-input"
                    />
                    <button type="submit" className="glass-btn glass-btn-primary">Register</button>
                </form>
            </section>

            {/* Right Column: Credit Directory Table */}
            <section className="glass-panel" style={{ height: 'fit-content' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Credit Directory</h3>
                <div style={{ overflowX: 'auto', maxHeight: '450px', overflowY: 'auto' }}>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Outstanding Debt</th>
                            {currentUser?.role === 'ADMIN' && <th>Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan={currentUser?.role === 'ADMIN' ? 4 : 3} style={{ textAlign: 'center', opacity: 0.5, padding: '30px' }}>
                                    No registered customers found.
                                </td>
                            </tr>
                        ) : (
                            customers.map((c) => {
                                const isEditing = editingRows[c.customerId] !== undefined;
                                const editData = editingRows[c.customerId] || {};

                                return (
                                    <tr key={c.customerId}>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={e => handleInputChange(c.customerId, 'name', e.target.value)}
                                                    className="glass-input"
                                                    style={{ padding: '6px', fontSize: '0.9em' }}
                                                />
                                            ) : (
                                                <strong style={{ display: 'block' }}>{c.name}</strong>
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editData.phone}
                                                    onChange={e => handleInputChange(c.customerId, 'phone', e.target.value)}
                                                    className="glass-input"
                                                    style={{ padding: '6px', fontSize: '0.9em' }}
                                                />
                                            ) : (
                                                c.phone
                                            )}
                                        </td>
                                        <td style={{ color: c.outstandingBalance > 0 ? '#ff416c' : 'inherit', fontWeight: 'bold' }}>
                                            LKR {c.outstandingBalance ? c.outstandingBalance.toFixed(2) : '0.00'}
                                        </td>
                                        {currentUser?.role === 'ADMIN' && (
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSaveCustomer(c)}
                                                                className="glass-btn glass-btn-primary"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em' }}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelClick(c.customerId)}
                                                                className="glass-btn"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em', background: 'transparent' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditClick(c)}
                                                                className="glass-btn"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em', borderColor: '#2ed573', color: '#2ed573', background: 'transparent' }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCustomer(c.customerId, c.name)}
                                                                className="glass-btn"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em', borderColor: '#ff4b2b', color: '#ff4b2b', background: 'transparent' }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}