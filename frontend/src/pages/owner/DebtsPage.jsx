import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form, Badge, InputGroup } from 'react-bootstrap';
import { CreditCard, Search, Plus, Filter, RefreshCcw, DollarSign, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { paymentService } from '../../services/api';

const DebtsPage = () => {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        payment_method: 'cash',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await paymentService.getDebts(true);
            setDebts(response.data.results || response.data);
        } catch (error) {
            toast.error("Failed to load debt records");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await paymentService.recordPayment({
                sale_id: selectedDebt.sale,
                customer_id: selectedDebt.customer,
                amount: paymentForm.amount,
                payment_method: paymentForm.payment_method,
                notes: paymentForm.notes
            });
            toast.success("Payment recorded successfully");
            setShowPaymentModal(false);
            setPaymentForm({ amount: '', payment_method: 'cash', notes: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to record payment");
        }
    };

    const openPaymentModal = (debt) => {
        setSelectedDebt(debt);
        setPaymentForm({
            amount: debt.remaining_amount,
            payment_method: 'cash',
            notes: `Debt payment for Sale #${debt.sale}`
        });
        setShowPaymentModal(true);
    };

    const totalOutstanding = debts.reduce((acc, curr) => acc + parseFloat(curr.remaining_amount), 0).toFixed(2);

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Debt Tracking 💳</h2>
                    <p className="text-muted mb-0">Record and manage outstanding customer balances.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="p-2 rounded-3" onClick={fetchData}>
                        <RefreshCcw size={20} />
                    </Button>
                    <Card className="border-0 shadow-sm bg-danger text-white px-3 py-1 rounded-3 d-flex align-items-center justify-content-center">
                        <div className="small opacity-75 fw-bold">TOTAL OUTSTANDING</div>
                        <div className="h5 fw-bold mb-0">₹{totalOutstanding}</div>
                    </Card>
                </div>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <h5 className="fw-bold mb-0">Pending Debts</h5>
                    <div className="d-flex gap-2">
                        <InputGroup size="sm" style={{ width: '250px' }}>
                            <InputGroup.Text className="bg-light border-0"><Search size={16} /></InputGroup.Text>
                            <Form.Control placeholder="Search customers..." className="bg-light border-0 shadow-none" />
                        </InputGroup>
                    </div>
                </div>
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Customer</th>
                            <th className="py-3">Sale Date</th>
                            <th className="py-3">Total Amount</th>
                            <th className="py-3">Paid Amount</th>
                            <th className="py-3">Remaining</th>
                            <th className="py-3">Status</th>
                            <th className="px-4 py-3 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debts.map((debt) => (
                            <tr key={debt.id}>
                                <td className="px-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="bg-light p-2 rounded-circle">
                                            <UserIcon size={16} className="text-primary" />
                                        </div>
                                        <span className="fw-bold">{debt.customer_name}</span>
                                    </div>
                                </td>
                                <td className="small text-muted">{new Date(debt.created_at).toLocaleDateString()}</td>
                                <td>₹{debt.total_amount}</td>
                                <td className="text-success">₹{debt.paid_amount}</td>
                                <td className="fw-bold text-danger">₹{debt.remaining_amount}</td>
                                <td>
                                    <Badge bg={debt.status === 'unpaid' ? 'danger-subtle' : 'warning-subtle'} className={`text-${debt.status === 'unpaid' ? 'danger' : 'warning'} rounded-pill`}>
                                        {debt.status.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="px-4 text-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="rounded-pill px-3 shadow-sm"
                                        onClick={() => openPaymentModal(debt)}
                                    >
                                        Pay Now
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {debts.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-5 text-muted">
                                    No pending debts found. Good job! ☕
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Record Payment</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handlePaymentSubmit}>
                    <Modal.Body className="p-4">
                        <div className="bg-light p-3 rounded-4 mb-4 text-center border">
                            <p className="text-muted small mb-1">Recording payment for</p>
                            <h5 className="fw-bold mb-1">{selectedDebt?.customer_name}</h5>
                            <p className="text-danger fw-bold mb-0">Balance: ₹{selectedDebt?.remaining_amount}</p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Payment Amount (₹)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                max={selectedDebt?.remaining_amount}
                                min="0.01"
                                value={paymentForm.amount}
                                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Payment Method</Form.Label>
                            <Form.Select
                                value={paymentForm.payment_method}
                                onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                            >
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-0">
                            <Form.Label className="fw-semibold">Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={paymentForm.notes}
                                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4 py-2 fw-bold shadow">Record Payment</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout>
    );
};

export default DebtsPage;
