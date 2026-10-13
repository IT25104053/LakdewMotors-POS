import { useState } from 'react';

export default function PosTab({ parts, cart, addToCart, removeFromCart, discountPercent, setDiscountPercent, subTotal, calculatedDiscountAmount, finalTotal, paymentMethod, setPaymentMethod, customers, selectedCustomerId, setSelectedCustomerId, handleCheckout }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter parts based on search input (matching name, brand, or SKU/partId)
    const filteredParts = parts.filter(part => {
        const query = searchQuery.toLowerCase();
        const name = (part.partName || '').toLowerCase();
        const brand = (part.brand || '').toLowerCase();
        const id = (part.partId || '').toLowerCase();
        return name.includes(query) || brand.includes(query) || id.includes(query);
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0 }}>Terminal</h2>
                </div>

                {/* Live Search Bar with Instant Suggestions */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search spare parts by name, brand, or SKU..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="glass-input"
                        style={{ padding: '14px 18px', fontSize: '1.05em' }}
                    />

                    {/* Live Suggestion / No Match Feedback Area */}
                    {searchQuery.trim() !== '' && (
                        <div className="glass-panel" style={{ position: 'absolute', top: '105%', left: 0, width: '100%', zIndex: 100, padding: '12px 18px', maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredParts.length === 0 ? (
                                <div style={{ color: '#ff416c', fontWeight: '600', textAlign: 'center', padding: '5px 0' }}>
                                    ❌ No matching part found in inventory.
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '8px' }}>
                                    Found {filteredParts.length} matching suggestion{filteredParts.length > 1 ? 's' : ''}:
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Filtered Product Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '5px' }}>
                    {filteredParts.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                            <p>No inventory items match your search criteria.</p>
                        </div>
                    ) : (
                        filteredParts.map(part => {
                            // Dynamically calculate remaining stock based on items already in the cart
                            const cartItem = cart.find(item => item.partId === part.partId);
                            const cartQuantity = cartItem ? cartItem.quantity : 0;
                            const availableStock = part.stockQuantity - cartQuantity;

                            return (
                                <div
                                    key={part.partId}
                                    onClick={() => availableStock > 0 && addToCart(part)}
                                    className="glass-panel glass-btn"
                                    style={{
                                        padding: '18px',
                                        textAlign: 'center',
                                        opacity: availableStock > 0 ? 1 : 0.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        cursor: availableStock > 0 ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <div>
                                        <small style={{ display: 'block', color: '#ff416c', fontWeight: 'bold', marginBottom: '4px' }}>SKU: {part.partId}</small>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95em', lineHeight: '1.3' }}>{part.partName}</h4>
                                        <small style={{ color: 'inherit', opacity: 0.6 }}>{part.brand}</small>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <p className="text-theme" style={{ margin: '0 0 6px 0', fontSize: '1.1em', fontWeight: 'bold' }}>LKR {part.unitPrice}</p>
                                        <p style={{ margin: 0, fontSize: '0.8em', color: availableStock < 5 ? '#ff4b2b' : 'inherit', opacity: 0.8 }}>
                                            Stock: {availableStock}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Cart Summary Section */}
            <section className="glass-panel" style={{ height: 'fit-content' }}>
                <h2 style={{ marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Current Cart</h2>
                <div style={{ minHeight: '150px', maxHeight: '250px', overflowY: 'auto' }}>
                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', opacity: 0.5, padding: '30px 0' }}>Cart is empty.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.partId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.1)', padding: '12px 0' }}>
                                <div><strong>{item.partName}</strong> <div style={{ fontSize: '0.85em', opacity: 0.7 }}>{item.quantity} x LKR {item.unitPrice}</div></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontWeight: 'bold' }}>LKR {item.quantity * item.unitPrice}</span>
                                    <button onClick={() => removeFromCart(item.partId)} className="glass-btn" style={{ padding: '4px 10px', borderColor: '#ff4b2b', color: '#ff4b2b', background: 'transparent' }}>X</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span>Subtotal:</span><strong>LKR {subTotal.toFixed(2)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span>Discount (%):</span>
                        <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value) || 0)} className="glass-input" style={{ width: '80px', textAlign: 'right' }} />
                    </div>
                    <div className="text-theme" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3em', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '12px', marginBottom: '20px' }}>
                        <strong>Final Total:</strong><strong>LKR {finalTotal.toFixed(2)}</strong>
                    </div>

                    <div className="glass-input" style={{ marginBottom: '15px' }}>
                        <strong style={{ display: 'block', marginBottom: '8px' }}>Payment Method:</strong>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                            <label style={{ cursor: 'pointer' }}><input type="radio" name="payment" value="CASH" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} style={{ marginRight: '6px' }}/>Cash</label>
                            <label style={{ cursor: 'pointer' }}><input type="radio" name="payment" value="CREDIT" checked={paymentMethod === 'CREDIT'} onChange={() => setPaymentMethod('CREDIT')} style={{ marginRight: '6px' }}/>Credit</label>
                        </div>
                        {paymentMethod === 'CREDIT' && (
                            <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="glass-input">
                                <option value="" disabled>-- Select Registered Customer --</option>
                                {customers.map(c => <option key={c.customerId} value={c.customerId}>{c.name} (Owes: LKR {c.outstandingBalance})</option>)}
                            </select>
                        )}
                    </div>

                    <button onClick={handleCheckout} disabled={cart.length === 0} className="glass-btn glass-btn-primary" style={{ width: '100%', padding: '14px', opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>Complete Checkout</button>
                </div>
            </section>
        </div>
    );
}