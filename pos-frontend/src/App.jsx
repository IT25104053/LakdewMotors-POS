import { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import InventoryTab from './components/InventoryTab';
import PosTab from './components/PosTab';
import CustomersTab from './components/CustomersTab';
import SuppliersTab from './components/SuppliersTab';
import EmployeesTab from './components/EmployeesTab';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('pos');
  const [theme, setTheme] = useState('dark');

  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payrollList, setPayrollList] = useState([]);

  const [categoryForm, setCategoryForm] = useState({ categoryName: '', description: '' });
  const [partForm, setPartForm] = useState({ partId: '', partName: '', brand: '', unitPrice: '', stockQuantity: '', categoryId: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '' });
  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '' });
  const [poForm, setPoForm] = useState({ supplierId: '', expectedDelivery: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', role: '', hourlyRate: '' });
  const [payrollForm, setPayrollForm] = useState({ empId: '', month: '', totalHours: '' });

  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const showToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const fetchData = () => {
    if (!currentUser) return;
    axios.get('http://localhost:8080/api/categories').then(res => setCategories(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/parts').then(res => setParts(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/customers').then(res => setCustomers(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/suppliers').then(res => setSuppliers(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/purchase-orders').then(res => setPurchaseOrders(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/sales').then(res => setSales(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/employees').then(res => setEmployees(res.data)).catch(console.error);
    axios.get('http://localhost:8080/api/payroll').then(res => setPayrollList(res.data)).catch(console.error);
  };

  useEffect(() => { fetchData(); }, [currentUser]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const parseDate = (dateVal) => {
    if (!dateVal) return 'Unknown Date';
    if (Array.isArray(dateVal)) {
      const [y, m, d, h, min, s] = dateVal;
      return new Date(y, m-1, d, h||0, min||0, s||0).toLocaleString();
    }
    return new Date(dateVal).toLocaleString();
  };

  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/login', loginForm)
        .then(res => {
          setCurrentUser(res.data);
          setActiveTab(res.data.role === 'ADMIN' ? 'dashboard' : 'pos');
          showToast(`Welcome back, ${res.data.username}!`, 'success');
        })
        .catch(() => showToast('Invalid username or password!', 'error'));
  };

  const handleLogout = () => { setCurrentUser(null); setLoginForm({ username: '', password: '' }); setCart([]); };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/categories', categoryForm).then(() => {
      setCategoryForm({ categoryName: '', description: '' });
      fetchData();
      showToast('Category created successfully!', 'success');
    });
  };

  const handlePartSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(partForm.unitPrice);
    const stock = parseFloat(partForm.stockQuantity);

    if (!partForm.partId || !partForm.partId.trim()) return showToast("Validation Error: SKU / Part ID is required.", "error");
    if (price <= 0) return showToast("Validation Error: Unit price must be a positive number.", "error");
    if (stock < 0 || !Number.isInteger(stock)) return showToast("Validation Error: Stock quantity must be a positive whole integer.", "error");

    const payload = {
      partId: partForm.partId.trim(),
      partName: partForm.partName,
      brand: partForm.brand,
      unitPrice: price,
      stockQuantity: stock,
      category: { categoryId: partForm.categoryId }
    };

    axios.post('http://localhost:8080/api/parts', payload).then(() => {
      setPartForm({ partId: '', partName: '', brand: '', unitPrice: '', stockQuantity: '', categoryId: '' });
      fetchData();
      showToast('Spare part added to inventory!', 'success');
    }).catch(err => {
      showToast(err.response?.data || 'Failed to add spare part. SKU might already exist.', 'error');
    });
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!isValidName(customerForm.name)) return showToast("Validation Error: Name must contain only letters and spaces.", "error");
    if (!isValidPhone(customerForm.phone)) return showToast("Validation Error: Phone number must be exactly 10 digits.", "error");

    axios.post('http://localhost:8080/api/customers', customerForm).then(() => {
      setCustomerForm({ name: '', phone: '' });
      fetchData();
      showToast('Customer registered successfully!', 'success');
    }).catch(() => showToast('Failed to save customer', 'error'));
  };

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    if (!isValidName(supplierForm.name)) return showToast("Validation Error: Supplier name must contain only letters and spaces.", "error");
    if (!isValidPhone(supplierForm.phone)) return showToast("Validation Error: Phone number must be exactly 10 digits.", "error");

    axios.post('http://localhost:8080/api/suppliers', supplierForm).then(() => {
      setSupplierForm({ name: '', phone: '' });
      fetchData();
      showToast('Supplier registered!', 'success');
    }).catch(() => showToast('Failed to save supplier', 'error'));
  };

  const handlePoSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/purchase-orders', poForm).then(() => {
      setPoForm({ supplierId: '', expectedDelivery: '' });
      fetchData();
      showToast('Purchase Order issued successfully!', 'success');
    }).catch(() => showToast('Failed to create PO', 'error'));
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/employees', employeeForm)
        .then(() => {
          setEmployeeForm({ name: '', role: '', hourlyRate: '' });
          fetchData();
          showToast('Employee registered successfully!', 'success');
        })
        .catch(() => showToast('Failed to register employee', 'error'));
  };

  const handlePayrollSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/payroll', payrollForm)
        .then(() => {
          setPayrollForm({ empId: '', month: '', totalHours: '' });
          fetchData();
          showToast('Payroll computed and saved!', 'success');
        })
        .catch(() => showToast('Failed to compute payroll', 'error'));
  };

  const markPoAsReceived = (poId) => {
    axios.put(`http://localhost:8080/api/purchase-orders/${poId}/receive`).then(() => {
      fetchData();
      showToast('Shipment marked as received.', 'success');
    }).catch(() => showToast('Failed to update PO status', 'error'));
  };

  const addToCart = (part) => {
    if (part.stockQuantity <= 0) return showToast('Out of stock!', 'error');
    const existing = cart.find(item => item.partId === part.partId);
    if (existing) {
      if (existing.quantity >= part.stockQuantity) return showToast('Not enough stock available!', 'error');
      setCart(cart.map(item => item.partId === part.partId ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...part, quantity: 1 }]);
    }
  };
  const removeFromCart = (partId) => setCart(cart.filter(item => item.partId !== partId));

  const subTotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const calculatedDiscountAmount = subTotal * (discountPercent / 100);
  const finalTotal = subTotal - calculatedDiscountAmount;

  const handleCheckout = () => {
    if (paymentMethod === 'CREDIT' && !selectedCustomerId) return showToast('Please select a customer for credit checkout!', 'error');
    if (discountPercent < 0 || discountPercent > 100) return showToast('Validation Error: Discount must be between 0 and 100.', 'error');

    const payload = {
      subTotal, discountAmount: calculatedDiscountAmount, finalTotal, paymentMethod,
      customerId: paymentMethod === 'CREDIT' ? selectedCustomerId : null,
      cashierName: currentUser.username,
      items: cart.map(item => ({ partId: item.partId, quantity: item.quantity, subTotal: item.unitPrice * item.quantity }))
    };
    axios.post('http://localhost:8080/api/checkout', payload).then(() => {
      showToast(`Checkout Complete via ${paymentMethod}!`, 'success');
      setCart([]); setDiscountPercent(0); setPaymentMethod('CASH'); setSelectedCustomerId(''); fetchData();
    }).catch(() => showToast('Checkout failed.', 'error'));
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.finalTotal || 0), 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
  const lowStockParts = parts.filter(p => p.stockQuantity < 5);
  const topDebtors = [...customers].sort((a, b) => b.outstandingBalance - a.outstandingBalance).slice(0, 5);
  const recentSales = [...sales].sort((a, b) => {
    const timeA = Array.isArray(a.orderDate) ? new Date(a.orderDate[0], a.orderDate[1]-1, a.orderDate[2], a.orderDate[3]||0, a.orderDate[4]||0, a.orderDate[5]||0).getTime() : new Date(a.orderDate || 0).getTime();
    const timeB = Array.isArray(b.orderDate) ? new Date(b.orderDate[0], b.orderDate[1]-1, b.orderDate[2], b.orderDate[3]||0, b.orderDate[4]||0, b.orderDate[5]||0).getTime() : new Date(b.orderDate || 0).getTime();
    return timeB - timeA;
  }).slice(0, 8);

  const cashierSalesMap = sales.reduce((acc, order) => {
    const name = order.cashierName || 'Unknown';
    acc[name] = (acc[name] || 0) + (order.finalTotal || 0);
    return acc;
  }, {});
  const topCashiers = Object.entries(cashierSalesMap).sort((a, b) => b[1] - a[1]);

  const glassStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
    
    * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }
    body { 
      margin: 0; min-height: 100vh; 
      background-color: ${theme === 'dark' ? '#050505' : '#e2e8f0'}; 
      color: ${theme === 'dark' ? '#ffffff' : '#0f172a'}; 
      position: relative; z-index: 0;
    }

    body::before {
      content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-image: url('/lakdew-logo.png'); background-size: cover; background-position: center;
      filter: ${theme === 'dark' ? 'invert(1) hue-rotate(180deg) blur(12px) brightness(0.45)' : 'blur(20px) brightness(1.25) opacity(0.22)'}; 
      z-index: -1;
    }
    
    .glass-panel { 
      background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.62)'}; 
      backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); 
      border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.18)'}; 
      border-radius: 16px; box-shadow: ${theme === 'dark' ? '0 10px 40px rgba(0, 0, 0, 0.6)' : '0 10px 35px rgba(15, 23, 42, 0.1)'}; 
      padding: 24px; 
    }
    
    .glass-btn { 
      background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.8)'}; 
      color: ${theme === 'dark' ? '#050505' : '#0f172a'}; backdrop-filter: blur(10px); 
      border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.2)'}; 
      border-radius: 8px; padding: 12px 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
      font-weight: 700; text-transform: uppercase; letter-spacing: 1px; 
    }
    .glass-btn:hover { 
      background: #ffffff !important; 
      color: #050505 !important; 
      border-color: rgba(15, 23, 42, 0.3) !important;
      transform: translateY(-3px); 
    }
    
    .glass-btn-primary { 
      background: linear-gradient(135deg, #ff4b2b, #ff416c); 
      color: #fff !important;
      border: none;
    }
    .glass-btn-primary:hover {
      background: #ffffff !important;
      color: #050505 !important;
      border: 1px solid rgba(15, 23, 42, 0.3) !important;
    }
    
    .glass-input { 
      width: 100%; background: ${theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.75)'}; 
      border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.22)'}; 
      border-radius: 8px; padding: 12px; color: ${theme === 'dark' ? '#fff' : '#0f172a'}; font-size: 1em; 
    }
    .glass-input:focus { outline: none; border-color: #ff416c; }
    select.glass-input option { background: ${theme === 'dark' ? '#050505' : '#fff'}; color: ${theme === 'dark' ? '#fff' : '#000'}; }
    
    table { width: 100%; border-collapse: collapse; }
    th { padding: 15px; text-align: left; border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.2)'}; font-weight: 700; text-transform: uppercase; font-size: 0.85em; color: ${theme === 'dark' ? 'rgba(255,255,255,0.9)' : '#1e293b'}; }
    td { padding: 15px; border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)'}; color: ${theme === 'dark' ? '#fff' : '#0f172a'}; }
    tr:hover td { background: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)'}; }
    
    .toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { padding: 15px 25px; border-left: 4px solid; display: flex; align-items: center; justify-content: space-between; background: ${theme === 'dark' ? 'rgba(10,10,10,0.85)' : 'rgba(255,255,255,0.95)'}; color: ${theme === 'dark' ? '#fff' : '#0f172a'}; }
    
    .stat-card { position: relative; overflow: hidden; }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; z-index: 2; }
    .stat-rev::before { background: #ff416c; }
    .stat-cnt::before { background: #ff4b2b; }
    .stat-wrn::before { background: #f6d365; }
    .stat-crd::before { background: #ff416c; }
    
    .stat-card div:first-child { color: ${theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#475569'} !important; }
    .stat-card div:last-child { color: ${theme === 'dark' ? '#fff' : '#0f172a'} !important; }

    @keyframes pulse-dot {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 65, 108, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 65, 108, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 65, 108, 0); }
    }
    .notification-dot {
      position: absolute; top: -5px; right: -5px; width: 14px; height: 14px;
      background-color: #ff416c; border-radius: 50%; animation: pulse-dot 1.5s infinite;
      border: 2px solid ${theme === 'dark' ? '#050505' : '#fff'};
    }

    h1, h2, h3, p, span, strong { color: inherit; }
    .text-theme { color: #ff416c; }
    .text-warning { color: #d97706; }
  `;

  if (!currentUser) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <style>{glassStyles}</style>
          <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className="glass-panel toast" style={{ borderLeftColor: '#ff416c' }}>
                  <span style={{ fontWeight: '600' }}>{t.msg}</span>
                </div>
            ))}
          </div>

          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '85px', height: '85px', borderRadius: '50%', overflow: 'hidden', marginBottom: '15px', border: '2px solid rgba(255, 65, 108, 0.5)', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src="/lakdew-logo.png" alt="Logo" style={{ width: '160%', height: '160%', objectFit: 'cover', filter: 'invert(1) hue-rotate(180deg)' }} />
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>Lakdew Motors</h2>
            <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '25px' }}>System Authentication</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              <input type="text" placeholder="Username" required value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="glass-input" />
              <input type="password" placeholder="Password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="glass-input" />
              <button type="submit" className="glass-btn glass-btn-primary" style={{ marginTop: '10px' }}>Access System</button>
            </form>
          </div>
        </div>
    );
  }

  return (
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px', paddingBottom: '50px' }}>
        <style>{glassStyles}</style>

        <div className="toast-container">
          {toasts.map(t => (
              <div key={t.id} className="glass-panel toast" style={{ borderLeftColor: '#ff416c' }}>
                <span style={{ fontWeight: '600' }}>{t.msg}</span>
              </div>
          ))}
        </div>

        <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
            fetchData={fetchData}
            showToast={showToast}
            customers={customers}
            sales={sales}
        />

        {activeTab === 'dashboard' && currentUser.role === 'ADMIN' && (
            <DashboardTab
                totalRevenue={totalRevenue}
                sales={sales}
                lowStockParts={lowStockParts}
                totalOutstanding={totalOutstanding}
                topDebtors={topDebtors}
                topCashiers={topCashiers}
                recentSales={recentSales}
                parseDate={parseDate}
            />
        )}

        {activeTab === 'inventory' && currentUser.role === 'ADMIN' && (
            <InventoryTab
                currentUser={currentUser}
                categories={categories}
                parts={parts}
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                partForm={partForm}
                setPartForm={setPartForm}
                handleCategorySubmit={handleCategorySubmit}
                handlePartSubmit={handlePartSubmit}
                fetchData={fetchData}
                showToast={showToast}
            />
        )}

        {activeTab === 'pos' && (
            <PosTab
                parts={parts}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                subTotal={subTotal}
                calculatedDiscountAmount={calculatedDiscountAmount}
                finalTotal={finalTotal}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                setSelectedCustomerId={setSelectedCustomerId}
                handleCheckout={handleCheckout}
            />
        )}

        {activeTab === 'customers' && (
            <CustomersTab
                currentUser={currentUser}
                customerForm={customerForm}
                setCustomerForm={setCustomerForm}
                handleCustomerSubmit={handleCustomerSubmit}
                customers={customers}
                fetchData={fetchData}
                showToast={showToast}
            />
        )}

        {activeTab === 'suppliers' && currentUser.role === 'ADMIN' && (
            <SuppliersTab
                currentUser={currentUser}
                supplierForm={supplierForm}
                setSupplierForm={setSupplierForm}
                handleSupplierSubmit={handleSupplierSubmit}
                suppliers={suppliers}
                poForm={poForm}
                setPoForm={setPoForm}
                handlePoSubmit={handlePoSubmit}
                purchaseOrders={purchaseOrders}
                parseDate={parseDate}
                markPoAsReceived={markPoAsReceived}
                fetchData={fetchData}
                showToast={showToast}
            />
        )}

        {activeTab === 'employees' && currentUser.role === 'ADMIN' && (
            <EmployeesTab
                currentUser={currentUser}
                employees={employees}
                employeeForm={employeeForm}
                setEmployeeForm={setEmployeeForm}
                handleEmployeeSubmit={handleEmployeeSubmit}
                payrollList={payrollList}
                payrollForm={payrollForm}
                setPayrollForm={setPayrollForm}
                handlePayrollSubmit={handlePayrollSubmit}
                parseDate={parseDate}
                fetchData={fetchData}
                showToast={showToast}
            />
        )}
      </div>
  );
}

export default App;