import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Navbar({ currentUser, activeTab, setActiveTab, handleLogout, theme, toggleTheme, fetchData, showToast, customers, sales }) {
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [newCashier, setNewCashier] = useState({ username: '', password: '', role: 'CASHIER' });
    const [usersList, setUsersList] = useState([]);
    const [userToDelete, setUserToDelete] = useState('');

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef(null);

    useEffect(() => {
        if (currentUser.role !== 'ADMIN') return;
        let notifs = [];
        if (customers) {
            customers.forEach(c => {
                if (c.outstandingBalance >= 100000) {
                    notifs.push({
                        id: `c_${c.customerId}`,
                        title: '⚠️ High Credit Alert',
                        text: `Customer ${c.name} has exceeded 100,000 LKR in credit (Current: LKR ${c.outstandingBalance.toFixed(2)}).`,
                        type: 'warning'
                    });
                }
            });
        }

        if (sales) {
            const cashierTotals = {};
            sales.forEach(s => {
                const name = s.cashierName || 'Unknown';
                cashierTotals[name] = (cashierTotals[name] || 0) + (s.finalTotal || 0);
            });

            Object.entries(cashierTotals).forEach(([name, total]) => {
                if (total >= 1000000) {
                    notifs.push({
                        id: `s_${name}`,
                        title: '🏆 Sales Milestone',
                        text: `Cashier ${name.toUpperCase()} has surpassed 1,000,000 LKR in lifetime sales!`,
                        type: 'success'
                    });
                }
            });
        }

        setNotifications(prev => {
            if (notifs.length > prev.length) setHasUnread(true);
            return notifs;
        });
    }, [customers, sales, currentUser.role]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                if (isNotifOpen) {
                    setIsNotifOpen(false);
                    setHasUnread(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isNotifOpen]);

    const toggleNotifPane = () => {
        setIsNotifOpen(!isNotifOpen);
        if (!isNotifOpen) setHasUnread(false);
    };

    const fetchUsers = () => {
        axios.get('http://localhost:8080/api/users')
            .then(res => setUsersList(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        if (isAdminPanelOpen) fetchUsers();
    }, [isAdminPanelOpen]);

    const handleRegisterCashier = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/users/register', newCashier)
            .then(() => {
                showToast('Cashier account created successfully!', 'success');
                setNewCashier({ username: '', password: '', role: 'CASHIER' });
                fetchUsers();
            })
            .catch(() => showToast('Failed to create account.', 'error'));
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return showToast('Please select a user to delete.', 'error');
        if (window.confirm('Permanent delete user?')) {
            axios.delete(`http://localhost:8080/api/users/${userToDelete}`)
                .then(() => {
                    showToast('User deleted successfully.', 'success');
                    setUserToDelete('');
                    fetchUsers();
                })
                .catch(() => showToast('Failed to delete user.', 'error'));
        }
    };

    return (
        <div>
            <header className="glass-panel" style={{ position: 'relative', zIndex: 9999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '20px 30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 style={{ margin: 0, whiteSpace: 'nowrap' }}>Lakdew Motors</h1>
                    <p style={{ margin: '5px 0 0', opacity: 0.8, whiteSpace: 'nowrap' }}>
                        Operator: <strong className="text-theme" style={{ textTransform: 'uppercase' }}>{currentUser.username}</strong> ({currentUser.role})
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

                    {currentUser.role === 'ADMIN' && (
                        <div style={{
                            display: 'flex', gap: '10px', alignItems: 'center',
                            border: theme === 'dark' ? '1.5px solid rgba(255, 255, 255, 0.4)' : '1.5px solid rgba(15, 23, 42, 0.25)',
                            padding: '6px', borderRadius: '12px',
                            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                        }}>
                            <button onClick={() => setActiveTab('dashboard')} className={`glass-btn ${activeTab === 'dashboard' ? 'glass-btn-primary' : ''}`} style={{ padding: '14px 24px', fontSize: '1.05em', whiteSpace: 'nowrap' }}>Dashboard</button>

                            <div style={{ position: 'relative' }} ref={notifRef}>
                                <button onClick={toggleNotifPane} className="glass-btn" style={{ padding: '14px 24px', fontSize: '1.05em', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }} title="Notifications">
                                    🔔
                                    {hasUnread && <span className="notification-dot" style={{ top: '8px', right: '12px' }}></span>}
                                </button>

                                {isNotifOpen && (
                                    <div className="glass-panel" style={{ position: 'absolute', top: '120%', left: 0, width: '350px', zIndex: 10000, animation: 'slideIn 0.2s ease', background: theme === 'dark' ? 'rgba(12, 12, 12, 0.92)' : 'rgba(255, 255, 255, 0.98)' }}>
                                        <h4 style={{ margin: '0 0 15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>System Notifications</h4>
                                        <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '5px' }}>
                                            {notifications.length === 0 ? (
                                                <p style={{ opacity: 0.6, fontSize: '0.9em', textAlign: 'center', margin: '20px 0' }}>No active alerts.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {notifications.map(n => (
                                                        <div key={n.id} style={{ padding: '12px', borderRadius: '8px', background: n.type === 'warning' ? 'rgba(255, 75, 43, 0.15)' : 'rgba(46, 213, 115, 0.15)', borderLeft: `4px solid ${n.type === 'warning' ? '#ff4b2b' : '#2ed573'}` }}>
                                                            <strong style={{ display: 'block', fontSize: '0.95em', marginBottom: '5px' }}>{n.title}</strong>
                                                            <span style={{ fontSize: '0.85em', opacity: 0.9 }}>{n.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => { setIsAdminPanelOpen(!isAdminPanelOpen); setIsNotifOpen(false); }} className="glass-btn" style={{ borderColor: '#ff416c', color: '#ff416c', padding: '14px 24px', fontSize: '1.05em', whiteSpace: 'nowrap' }}>
                                {isAdminPanelOpen ? 'Close Admin' : '⚙️ Admin Panel'}
                            </button>
                        </div>
                    )}

                    {currentUser.role === 'ADMIN' && (
                        <button onClick={() => setActiveTab('inventory')} className={`glass-btn ${activeTab === 'inventory' ? 'glass-btn-primary' : ''}`} style={{ whiteSpace: 'nowrap' }}>Inventory</button>
                    )}
                    <button onClick={() => setActiveTab('pos')} className={`glass-btn ${activeTab === 'pos' ? 'glass-btn-primary' : ''}`} style={{ whiteSpace: 'nowrap' }}>POS</button>
                    <button onClick={() => setActiveTab('customers')} className={`glass-btn ${activeTab === 'customers' ? 'glass-btn-primary' : ''}`} style={{ whiteSpace: 'nowrap' }}>Credit</button>
                    {currentUser.role === 'ADMIN' && (
                        <>
                            <button onClick={() => setActiveTab('suppliers')} className={`glass-btn ${activeTab === 'suppliers' ? 'glass-btn-primary' : ''}`} style={{ whiteSpace: 'nowrap' }}>Suppliers</button>
                            <button onClick={() => setActiveTab('employees')} className={`glass-btn ${activeTab === 'employees' ? 'glass-btn-primary' : ''}`} style={{ whiteSpace: 'nowrap' }}>Payroll</button>
                        </>
                    )}

                    <button onClick={toggleTheme} className="glass-btn" style={{ padding: '10px 15px', fontSize: '0.9em', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                    </button>

                    <button onClick={handleLogout} className="glass-btn" style={{ marginLeft: '5px', borderColor: '#ff4b2b', color: '#ff4b2b', whiteSpace: 'nowrap' }}>Logout</button>
                </div>
            </header>

            {currentUser.role === 'ADMIN' && isAdminPanelOpen && (
                <div className="glass-panel" style={{ position: 'relative', zIndex: 9998, marginBottom: '25px', animation: 'slideIn 0.3s ease' }}>
                    <h3 style={{ margin: '0 0 15px 0' }}>🛡 Admin Management</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <form onSubmit={handleRegisterCashier} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <input type="text" placeholder="Cashier Username" required value={newCashier.username} onChange={e => setNewCashier({...newCashier, username: e.target.value})} className="glass-input" style={{ flex: 1 }} />
                            <input type="password" placeholder="Password" required value={newCashier.password} onChange={e => setNewCashier({...newCashier, password: e.target.value})} className="glass-input" style={{ flex: 1 }} />
                            <button type="submit" className="glass-btn glass-btn-primary" style={{ whiteSpace: 'nowrap' }}>Create Cashier</button>
                        </form>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', borderTop: '1px dashed rgba(128,128,128,0.2)', paddingTop: '20px' }}>
                            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                <table style={{ width: '100%', fontSize: '0.9em' }}>
                                    <thead><tr><th>Username</th><th>Role</th></tr></thead>
                                    <tbody>
                                    {usersList.map(u => (
                                        <tr key={u.userId}><td><strong>{u.username}</strong></td><td>{u.role}</td></tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ padding: '15px', background: 'rgba(255, 75, 43, 0.05)', borderRadius: '10px', border: '1px solid rgba(255, 75, 43, 0.2)' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#ff4b2b' }}>Remove User</h4>
                                <select className="glass-input" value={userToDelete} onChange={(e) => setUserToDelete(e.target.value)} style={{ marginBottom: '10px' }}>
                                    <option value="" disabled>-- Select User --</option>
                                    {usersList.filter(u => u.username !== currentUser.username).map(u => (
                                        <option key={u.userId} value={u.userId}>{u.username} ({u.role})</option>
                                    ))}
                                </select>
                                <button onClick={handleDeleteUser} className="glass-btn" style={{ width: '100%', borderColor: '#ff4b2b', color: '#ff4b2b', background: 'transparent' }} disabled={!userToDelete}>Confirm Deletion</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}