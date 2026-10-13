export default function DashboardTab({ totalRevenue, sales, lowStockParts, totalOutstanding, topDebtors, topCashiers, recentSales, parseDate }) {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div className="glass-panel stat-card stat-rev">
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: '600' }}>Total Revenue</div>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#fff', marginTop: '5px' }}>LKR {totalRevenue.toFixed(2)}</div>
                </div>
                <div className="glass-panel stat-card stat-cnt">
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: '600' }}>Sales Count</div>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#fff', marginTop: '5px' }}>{sales.length}</div>
                </div>
                <div className="glass-panel stat-card stat-wrn">
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: '600' }}>Low Stock Items</div>
                    <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ff4b2b', marginTop: '5px' }}>{lowStockParts.length}</div>
                </div>
                <div className="glass-panel stat-card stat-crd">
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85em', textTransform: 'uppercase', fontWeight: '600' }}>Outstanding Credit</div>
                    <div className="text-warning" style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '5px' }}>LKR {totalOutstanding.toFixed(2)}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
                <div className="glass-panel">
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', color: '#ff4b2b' }}>⚠️ Restock Warnings</h3>
                    {lowStockParts.length === 0 ? <p className="text-theme">All stock levels healthy.</p> : lowStockParts.map(p => (
                        <div key={p.partId} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', marginBottom: '5px' }}>
                                <span>{p.partName}</span>
                                <span style={{ color: '#ff4b2b' }}>{p.stockQuantity} left</span>
                            </div>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
                                <div style={{ width: `${(p.stockQuantity / 5) * 100}%`, background: '#ff4b2b', height: '100%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="glass-panel">
                    <h3 className="text-warning" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>💳 Top Debtors</h3>
                    {topDebtors.filter(d => d.outstandingBalance > 0).length === 0 ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>No credit debt.</p> : topDebtors.filter(d => d.outstandingBalance > 0).map((d, index) => (
                        <div key={d.customerId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                            <span><strong>#{index + 1}</strong> {d.name}</span>
                            <span className="text-warning">LKR {d.outstandingBalance}</span>
                        </div>
                    ))}
                </div>

                <div className="glass-panel">
                    <h3 className="text-theme" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>🏆 Cashier Board</h3>
                    {topCashiers.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>No sales recorded.</p> : topCashiers.map(([name, total], index) => (
                        <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                            <span style={{ textTransform: 'uppercase' }}><strong>#{index + 1}</strong> {name}</span>
                            <span className="text-theme">LKR {total.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel">
                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>🕒 Checkout History</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date & Time</th>
                        <th>Cashier</th>
                        <th>Final Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentSales.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center' }}>No recent sales.</td></tr> : recentSales.map(sale => (
                        <tr key={sale.orderId}>
                            <td style={{ fontWeight: 'bold' }}>#{sale.orderId}</td>
                            <td style={{ color: 'rgba(255,255,255,0.6)' }}>{parseDate(sale.orderDate)}</td>
                            <td style={{ textTransform: 'uppercase' }}>{sale.cashierName || 'Unknown'}</td>
                            <td className="text-theme" style={{ fontWeight: 'bold' }}>LKR {sale.finalTotal}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}