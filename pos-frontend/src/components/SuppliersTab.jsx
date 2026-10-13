import { useState } from 'react';
import axios from 'axios';

export default function SuppliersTab({
                                         currentUser,
                                         supplierForm, setSupplierForm, handleSupplierSubmit,
                                         suppliers,
                                         poForm, setPoForm, handlePoSubmit,
                                         purchaseOrders, parseDate, markPoAsReceived,
                                         fetchData, showToast
                                     }) {
    const [editingRows, setEditingRows] = useState({});

    const handleEditClick = (supplier) => {
        setEditingRows(prev => ({
            ...prev,
            [supplier.supplierId]: { name: supplier.name, phone: supplier.phone }
        }));
    };

    const handleCancelClick = (supplierId) => {
        setEditingRows(prev => {
            const copy = { ...prev };
            delete copy[supplierId];
            return copy;
        });
    };

    const handleInputChange = (supplierId, field, value) => {
        setEditingRows(prev => ({
            ...prev,
            [supplierId]: { ...prev[supplierId], [field]: value }
        }));
    };

    const handleSaveSupplier = (supplier) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        const edits = editingRows[supplier.supplierId];
        if (!edits.name.trim() || !edits.phone.trim()) {
            showToast('Validation Error: Fields cannot be empty.', 'error');
            return;
        }

        const payload = {
            ...supplier,
            name: edits.name,
            phone: edits.phone
        };

        axios.put(`http://localhost:8080/api/suppliers/${supplier.supplierId}`, payload)
            .then(() => {
                showToast('Supplier updated successfully!', 'success');
                handleCancelClick(supplier.supplierId);
                if (fetchData) fetchData();
            })
            .catch(() => showToast('Failed to update supplier.', 'error'));
    };

    const handleDeleteSupplier = (supplierId, name) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to permanently delete supplier: ${name}?`)) {
            axios.delete(`http://localhost:8080/api/suppliers/${supplierId}`)
                .then(() => {
                    showToast('Supplier deleted successfully.', 'success');
                    if (fetchData) fetchData();
                })
                .catch(() => showToast('Failed to delete supplier. Ensure no active orders depend on it.', 'error'));
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '30px' }}>

            {/* Left Column: Data Entry Forms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* 1. Register Supplier */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>1. Register Supplier</h3>
                    <form onSubmit={handleSupplierSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Supplier Name"
                            required
                            value={supplierForm.name}
                            onChange={e => setSupplierForm({...supplierForm, name: e.target.value})}
                            className="glass-input"
                        />
                        <input
                            type="text"
                            placeholder="Contact Phone"
                            required
                            value={supplierForm.phone}
                            onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})}
                            className="glass-input"
                        />
                        <button type="submit" className="glass-btn glass-btn-primary">Save Supplier</button>
                    </form>
                </section>

                {/* 2. Create Purchase Order */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>2. Create Purchase Order</h3>
                    <form onSubmit={handlePoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <select
                            required
                            value={poForm.supplierId}
                            onChange={e => setPoForm({...poForm, supplierId: e.target.value})}
                            className="glass-input"
                        >
                            <option value="" disabled>-- Select Supplier --</option>
                            {suppliers.map(s => (
                                <option key={s.supplierId} value={s.supplierId}>{s.name}</option>
                            ))}
                        </select>
                        <input
                            type="datetime-local"
                            required
                            value={poForm.expectedDelivery}
                            onChange={e => setPoForm({...poForm, expectedDelivery: e.target.value})}
                            className="glass-input"
                        />
                        <button type="submit" className="glass-btn glass-btn-primary">Issue PO</button>
                    </form>
                </section>

            </div>

            {/* Right Column: Data Tables */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* Active Purchase Orders */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Active Purchase Orders</h3>
                    <div style={{ overflowX: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                            <tr>
                                <th>PO ID</th>
                                <th>Supplier</th>
                                <th>Expected Delivery</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {purchaseOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5, padding: '30px' }}>
                                        No active purchase orders.
                                    </td>
                                </tr>
                            ) : (
                                purchaseOrders.map(po => (
                                    <tr key={po.poId}>
                                        <td style={{ fontWeight: 'bold' }}>#{po.poId}</td>
                                        <td>{po.supplier ? po.supplier.name : 'Unknown'}</td>
                                        <td>{parseDate(po.expectedDelivery)}</td>
                                        <td>
                        <span style={{
                            color: po.status === 'PENDING' ? '#f6d365' : '#2ed573',
                            fontWeight: 'bold',
                            background: po.status === 'PENDING' ? 'rgba(246, 211, 101, 0.1)' : 'rgba(46, 213, 115, 0.1)',
                            padding: '4px 10px',
                            borderRadius: '6px'
                        }}>
                          {po.status}
                        </span>
                                        </td>
                                        <td>
                                            {po.status === 'PENDING' ? (
                                                <button
                                                    onClick={() => markPoAsReceived(po.poId)}
                                                    className="glass-btn"
                                                    style={{ padding: '6px 12px', fontSize: '0.85em', borderColor: '#2ed573', color: '#2ed573' }}
                                                >
                                                    Mark Received
                                                </button>
                                            ) : (
                                                <span style={{ opacity: 0.5, fontSize: '0.9em' }}>Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Registered Suppliers Table */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Registered Suppliers</h3>
                    <div style={{ overflowX: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Contact Phone</th>
                                {currentUser?.role === 'ADMIN' && <th>Actions</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={currentUser?.role === 'ADMIN' ? 3 : 2} style={{ textAlign: 'center', opacity: 0.5, padding: '30px' }}>
                                        No registered suppliers found.
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((s) => {
                                    const isEditing = editingRows[s.supplierId] !== undefined;
                                    const editData = editingRows[s.supplierId] || {};

                                    return (
                                        <tr key={s.supplierId}>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.name}
                                                        onChange={e => handleInputChange(s.supplierId, 'name', e.target.value)}
                                                        className="glass-input"
                                                        style={{ padding: '6px', fontSize: '0.9em' }}
                                                    />
                                                ) : (
                                                    <strong style={{ display: 'block' }}>{s.name}</strong>
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editData.phone}
                                                        onChange={e => handleInputChange(s.supplierId, 'phone', e.target.value)}
                                                        className="glass-input"
                                                        style={{ padding: '6px', fontSize: '0.9em' }}
                                                    />
                                                ) : (
                                                    s.phone
                                                )}
                                            </td>
                                            {currentUser?.role === 'ADMIN' && (
                                                <td>
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        {isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleSaveSupplier(s)}
                                                                    className="glass-btn glass-btn-primary"
                                                                    style={{ padding: '6px 10px', fontSize: '0.75em' }}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelClick(s.supplierId)}
                                                                    className="glass-btn"
                                                                    style={{ padding: '6px 10px', fontSize: '0.75em', background: 'transparent' }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditClick(s)}
                                                                    className="glass-btn"
                                                                    style={{ padding: '6px 10px', fontSize: '0.75em', borderColor: '#2ed573', color: '#2ed573', background: 'transparent' }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteSupplier(s.supplierId, s.name)}
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
        </div>
    );
}