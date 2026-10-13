import { useState } from 'react';
import axios from 'axios';

export default function InventoryTab({ currentUser, categories, parts, categoryForm, setCategoryForm, partForm, setPartForm, handleCategorySubmit, handlePartSubmit, fetchData, showToast }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');

    // Track editing state for parts: { [partId]: { unitPrice, stockQuantity } }
    const [editingRows, setEditingRows] = useState({});

    // Track editing state for categories: { [categoryId]: { categoryName, description } }
    const [editingCategories, setEditingCategories] = useState({});

    // Filter parts based on search query and selected category tile
    const filteredParts = parts.filter(part => {
        const query = searchQuery.toLowerCase();
        const name = (part.partName || '').toLowerCase();
        const brand = (part.brand || '').toLowerCase();
        const id = (part.partId || '').toLowerCase();
        const barcode = (part.barcode || '').toLowerCase();

        const matchesSearch = name.includes(query) || brand.includes(query) || id.includes(query) || barcode.includes(query);
        const matchesCategory = selectedCategoryId === 'ALL' || (part.category && String(part.category.categoryId) === String(selectedCategoryId));

        return matchesSearch && matchesCategory;
    });

    // Part Edit Handlers
    const handleEditClick = (part) => {
        setEditingRows(prev => ({
            ...prev,
            [part.partId]: { unitPrice: part.unitPrice, stockQuantity: part.stockQuantity }
        }));
    };

    const handleCancelClick = (partId) => {
        setEditingRows(prev => {
            const copy = { ...prev };
            delete copy[partId];
            return copy;
        });
    };

    const handleInputChange = (partId, field, value) => {
        setEditingRows(prev => ({
            ...prev,
            [partId]: { ...prev[partId], [field]: value }
        }));
    };

    const handleSavePart = (part) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        const edits = editingRows[part.partId];
        const newPrice = parseFloat(edits.unitPrice);
        const newStock = parseInt(edits.stockQuantity, 10);

        if (isNaN(newPrice) || newPrice < 0) {
            showToast('Validation Error: Price must be a valid positive number.', 'error');
            return;
        }
        if (isNaN(newStock) || newStock < 0) {
            showToast('Validation Error: Stock must be a valid whole number.', 'error');
            return;
        }

        const payload = {
            ...part,
            unitPrice: newPrice,
            stockQuantity: newStock
        };

        axios.put(`http://localhost:8080/api/parts/${part.partId}`, payload)
            .then(() => {
                showToast('Part updated successfully!', 'success');
                handleCancelClick(part.partId);
                if (fetchData) fetchData();
            })
            .catch(() => showToast('Failed to update part.', 'error'));
    };

    const handleDeletePart = (partId) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to permanently delete part SKU: ${partId}?`)) {
            axios.delete(`http://localhost:8080/api/parts/${partId}`)
                .then(() => {
                    showToast('Spare part deleted successfully.', 'success');
                    if (fetchData) fetchData();
                })
                .catch(() => showToast('Failed to delete spare part.', 'error'));
        }
    };

    // Category Edit Handlers
    const handleCategoryEditClick = (cat) => {
        setEditingCategories(prev => ({
            ...prev,
            [cat.categoryId]: { categoryName: cat.categoryName, description: cat.description }
        }));
    };

    const handleCategoryCancelClick = (categoryId) => {
        setEditingCategories(prev => {
            const copy = { ...prev };
            delete copy[categoryId];
            return copy;
        });
    };

    const handleCategoryInputChange = (categoryId, field, value) => {
        setEditingCategories(prev => ({
            ...prev,
            [categoryId]: { ...prev[categoryId], [field]: value }
        }));
    };

    const handleSaveCategory = (cat) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        const edits = editingCategories[cat.categoryId];
        if (!edits.categoryName.trim()) {
            showToast('Validation Error: Category name cannot be empty.', 'error');
            return;
        }

        axios.put(`http://localhost:8080/api/categories/${cat.categoryId}`, edits)
            .then(() => {
                showToast('Category updated successfully!', 'success');
                handleCategoryCancelClick(cat.categoryId);
                if (fetchData) fetchData();
            })
            .catch(() => showToast('Failed to update category.', 'error'));
    };

    const handleDeleteCategory = (categoryId, name) => {
        if (currentUser?.role !== 'ADMIN') {
            showToast('Unauthorized: Admin privileges required.', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
            axios.delete(`http://localhost:8080/api/categories/${categoryId}`)
                .then(() => {
                    showToast('Category deleted successfully.', 'success');
                    if (selectedCategoryId === String(categoryId)) setSelectedCategoryId('ALL');
                    if (fetchData) fetchData();
                })
                .catch(err => showToast(err.response?.data || 'Failed to delete category. Ensure no parts are assigned to it.', 'error'));
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>

            {/* Left Column: Data Entry & Category Management Panes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* Create Category */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Create Category</h3>
                    <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="Category Name" required value={categoryForm.categoryName} onChange={e => setCategoryForm({...categoryForm, categoryName: e.target.value})} className="glass-input" />
                        <input type="text" placeholder="Description" required value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="glass-input" />
                        <button type="submit" className="glass-btn glass-btn-primary">Save Category</button>
                    </form>
                </section>

                {/* Manage Categories (Independent Pane) */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Manage Categories</h3>
                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px' }}>
                        {categories.length === 0 ? (
                            <p style={{ opacity: 0.6, fontSize: '0.9em', textAlign: 'center', margin: '10px 0' }}>No categories registered.</p>
                        ) : (
                            categories.map(cat => {
                                const isEditingCat = editingCategories[cat.categoryId] !== undefined;
                                const editCatData = editingCategories[cat.categoryId] || {};

                                return (
                                    <div key={cat.categoryId} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {isEditingCat ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    value={editCatData.categoryName}
                                                    onChange={e => handleCategoryInputChange(cat.categoryId, 'categoryName', e.target.value)}
                                                    className="glass-input"
                                                    style={{ padding: '8px', fontSize: '0.9em' }}
                                                />
                                                <input
                                                    type="text"
                                                    value={editCatData.description}
                                                    onChange={e => handleCategoryInputChange(cat.categoryId, 'description', e.target.value)}
                                                    className="glass-input"
                                                    style={{ padding: '8px', fontSize: '0.9em' }}
                                                />
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button onClick={() => handleSaveCategory(cat)} className="glass-btn glass-btn-primary" style={{ padding: '6px 12px', fontSize: '0.75em' }}>Save</button>
                                                    <button onClick={() => handleCategoryCancelClick(cat.categoryId)} className="glass-btn" style={{ padding: '6px 12px', fontSize: '0.75em', background: 'transparent' }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <strong style={{ display: 'block', fontSize: '0.95em' }}>{cat.categoryName}</strong>
                                                    <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{cat.description}</span>
                                                </div>
                                                {currentUser?.role === 'ADMIN' && (
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <button onClick={() => handleCategoryEditClick(cat)} className="glass-btn" style={{ padding: '6px 10px', fontSize: '0.75em', borderColor: '#2ed573', color: '#2ed573', background: 'transparent' }}>Edit</button>
                                                        <button onClick={() => handleDeleteCategory(cat.categoryId, cat.categoryName)} className="glass-btn" style={{ padding: '6px 10px', fontSize: '0.75em', borderColor: '#ff4b2b', color: '#ff4b2b', background: 'transparent' }}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Add Spare Part */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Add Spare Part</h3>
                    <form onSubmit={handlePartSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" placeholder="SKU / Part ID (Manual Entry)" required value={partForm.partId} onChange={e => setPartForm({...partForm, partId: e.target.value})} className="glass-input" />
                        <select required value={partForm.categoryId} onChange={e => setPartForm({...partForm, categoryId: e.target.value})} className="glass-input">
                            <option value="" disabled>-- Select Category --</option>
                            {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                        </select>
                        <input type="text" placeholder="Part Name" required value={partForm.partName} onChange={e => setPartForm({...partForm, partName: e.target.value})} className="glass-input" />
                        <input type="text" placeholder="Brand" required value={partForm.brand} onChange={e => setPartForm({...partForm, brand: e.target.value})} className="glass-input" />
                        <input type="number" step="0.01" placeholder="Unit Price (LKR)" required value={partForm.unitPrice} onChange={e => setPartForm({...partForm, unitPrice: e.target.value})} className="glass-input" />
                        <input type="number" placeholder="Stock Quantity" required value={partForm.stockQuantity} onChange={e => setPartForm({...partForm, stockQuantity: e.target.value})} className="glass-input" />
                        <button type="submit" className="glass-btn glass-btn-primary">Save Spare Part</button>
                    </form>
                </section>
            </div>

            {/* Right Column: Inventory Table & Category Filter Tiles */}
            <section className="glass-panel" style={{ height: 'fit-content' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Current Inventory</h3>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search inventory by name, brand, SKU, or barcode..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="glass-input"
                        style={{ padding: '12px 18px', fontSize: '1em' }}
                    />

                    {searchQuery.trim() !== '' && (
                        <div className="glass-panel" style={{ position: 'absolute', top: '105%', left: 0, width: '100%', zIndex: 100, padding: '12px 18px', maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredParts.length === 0 ? (
                                <div style={{ color: '#ff416c', fontWeight: '600', textAlign: 'center', padding: '5px 0' }}>
                                    ❌ No matching part found in inventory.
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '8px', textAlign: 'center' }}>
                                    Found {filteredParts.length} matching item{filteredParts.length > 1 ? 's' : ''}.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Category Filter Tiles (3 columns per row layout) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '25px' }}>
                    <button
                        onClick={() => setSelectedCategoryId('ALL')}
                        className={`glass-btn ${selectedCategoryId === 'ALL' ? 'glass-btn-primary' : ''}`}
                        style={{ padding: '12px', fontSize: '0.85em', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.categoryId}
                            onClick={() => setSelectedCategoryId(String(cat.categoryId))}
                            className={`glass-btn ${String(selectedCategoryId) === String(cat.categoryId) ? 'glass-btn-primary' : ''}`}
                            style={{ padding: '12px', fontSize: '0.85em', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {cat.categoryName}
                        </button>
                    ))}
                </div>

                {/* Inventory Table with separate SKU and Barcode columns */}
                <div style={{ overflowX: 'auto', maxHeight: '550px', overflowY: 'auto' }}>
                    <table>
                        <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Barcode</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            {currentUser?.role === 'ADMIN' && <th>Actions</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredParts.length === 0 ? (
                            <tr>
                                <td colSpan={currentUser?.role === 'ADMIN' ? 7 : 6} style={{ textAlign: 'center', opacity: 0.5, padding: '30px' }}>
                                    No inventory items match your search or selected category.
                                </td>
                            </tr>
                        ) : (
                            filteredParts.map((part) => {
                                const isEditing = editingRows[part.partId] !== undefined;
                                const editData = editingRows[part.partId] || {};

                                return (
                                    <tr key={part.partId}>
                                        <td>
                                            <strong style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{part.partId}</strong>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.85em', opacity: 0.8 }}>{part.barcode}</span>
                                        </td>
                                        <td>
                                            <strong style={{ display: 'block' }}>{part.partName}</strong>
                                            <span style={{ fontSize: '0.85em', opacity: 0.6, textTransform: 'uppercase' }}>{part.brand}</span>
                                        </td>
                                        <td>{part.category ? part.category.categoryName : 'Uncategorized'}</td>

                                        {/* Price Column */}
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editData.unitPrice}
                                                    onChange={e => handleInputChange(part.partId, 'unitPrice', e.target.value)}
                                                    className="glass-input"
                                                    style={{ width: '90px', padding: '6px' }}
                                                />
                                            ) : (
                                                `LKR ${part.unitPrice}`
                                            )}
                                        </td>

                                        {/* Stock Column */}
                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editData.stockQuantity}
                                                    onChange={e => handleInputChange(part.partId, 'stockQuantity', e.target.value)}
                                                    className="glass-input"
                                                    style={{ width: '75px', padding: '6px' }}
                                                />
                                            ) : (
                                                <strong style={{ color: part.stockQuantity <= 0 ? '#ff4b2b' : 'inherit' }}>
                                                    {part.stockQuantity}
                                                </strong>
                                            )}
                                        </td>

                                        {/* Action Column for Admin */}
                                        {currentUser?.role === 'ADMIN' && (
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSavePart(part)}
                                                                className="glass-btn glass-btn-primary"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em' }}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelClick(part.partId)}
                                                                className="glass-btn"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em', background: 'transparent' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditClick(part)}
                                                                className="glass-btn"
                                                                style={{ padding: '6px 10px', fontSize: '0.75em', borderColor: '#2ed573', color: '#2ed573', background: 'transparent' }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePart(part.partId)}
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