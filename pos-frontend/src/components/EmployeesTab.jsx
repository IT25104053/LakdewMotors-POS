import { useState } from 'react';
import axios from 'axios';

export default function EmployeesTab({
                                         currentUser,
                                         employees, employeeForm, setEmployeeForm, handleEmployeeSubmit,
                                         payrollList, payrollForm, setPayrollForm, handlePayrollSubmit,
                                         parseDate, fetchData, showToast
                                     }) {
    const handleDeleteEmployee = (id, name) => {
        if (currentUser?.role !== 'ADMIN') return showToast('Unauthorized', 'error');
        if (window.confirm(`Delete employee ${name}?`)) {
            axios.delete(`http://localhost:8080/api/employees/${id}`)
                .then(() => { showToast('Employee deleted', 'success'); fetchData(); })
                .catch(() => showToast('Failed to delete employee', 'error'));
        }
    };

    const handleDeletePayroll = (id) => {
        if (currentUser?.role !== 'ADMIN') return showToast('Unauthorized', 'error');
        if (window.confirm('Delete this payroll record?')) {
            axios.delete(`http://localhost:8080/api/payroll/${id}`)
                .then(() => { showToast('Payroll deleted', 'success'); fetchData(); })
                .catch(() => showToast('Failed to delete payroll', 'error'));
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '30px' }}>

            {/* Left Column: Forms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* Register Employee */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>1. Register Employee</h3>
                    <form onSubmit={handleEmployeeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={employeeForm.name}
                            onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})}
                            className="glass-input"
                        />
                        <input
                            type="text"
                            placeholder="Role (e.g., Cashier, Mechanic)"
                            required
                            value={employeeForm.role}
                            onChange={e => setEmployeeForm({...employeeForm, role: e.target.value})}
                            className="glass-input"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Hourly Rate (LKR)"
                            required
                            value={employeeForm.hourlyRate}
                            onChange={e => setEmployeeForm({...employeeForm, hourlyRate: e.target.value})}
                            className="glass-input"
                        />
                        <button type="submit" className="glass-btn glass-btn-primary">Save Employee</button>
                    </form>
                </section>

                {/* Generate Payroll */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>2. Calculate Monthly Payroll</h3>
                    <form onSubmit={handlePayrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <select
                            required
                            value={payrollForm.empId}
                            onChange={e => setPayrollForm({...payrollForm, empId: e.target.value})}
                            className="glass-input"
                        >
                            <option value="" disabled>-- Select Employee --</option>
                            {employees.map(emp => (
                                <option key={emp.empId} value={emp.empId}>{emp.name} ({emp.role})</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Month (e.g., October 2026)"
                            required
                            value={payrollForm.month}
                            onChange={e => setPayrollForm({...payrollForm, month: e.target.value})}
                            className="glass-input"
                        />
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Total Hours Worked"
                            required
                            value={payrollForm.totalHours}
                            onChange={e => setPayrollForm({...payrollForm, totalHours: e.target.value})}
                            className="glass-input"
                        />
                        <button type="submit" className="glass-btn glass-btn-primary">Compute Salary</button>
                    </form>
                </section>

            </div>

            {/* Right Column: Tables */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                {/* Payroll Records Table */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Payroll & Salary Records</h3>
                    <div style={{ overflowX: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Month</th>
                                <th>Hours</th>
                                <th>Final Salary</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payrollList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', opacity: 0.5, padding: '30px' }}>No payroll records found.</td>
                                </tr>
                            ) : (
                                payrollList.map(p => (
                                    <tr key={p.payrollId}>
                                        <td><strong style={{ display: 'block' }}>{p.employee ? p.employee.name : 'Unknown'}</strong></td>
                                        <td>{p.month}</td>
                                        <td>{p.totalHours} hrs</td>
                                        <td style={{ color: '#2ed573', fontWeight: 'bold' }}>LKR {p.finalSalary.toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => handleDeletePayroll(p.payrollId)} className="glass-btn" style={{ padding: '6px 12px', fontSize: '0.8em', borderColor: '#ff4b2b', color: '#ff4b2b', background: 'transparent' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Registered Employees Table */}
                <section className="glass-panel">
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Staff Directory</h3>
                    <div style={{ overflowX: 'auto', maxHeight: '300px', overflowY: 'auto' }}>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Hourly Rate</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', opacity: 0.5, padding: '30px' }}>No employees registered.</td>
                                </tr>
                            ) : (
                                employees.map(emp => (
                                    <tr key={emp.empId}>
                                        <td><strong style={{ display: 'block' }}>{emp.name}</strong></td>
                                        <td>{emp.role}</td>
                                        <td>LKR {emp.hourlyRate.toFixed(2)} / hr</td>
                                        <td>
                                            <button onClick={() => handleDeleteEmployee(emp.empId, emp.name)} className="glass-btn" style={{ padding: '6px 12px', fontSize: '0.8em', borderColor: '#ff4b2b', color: '#ff4b2b', background: 'transparent' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}