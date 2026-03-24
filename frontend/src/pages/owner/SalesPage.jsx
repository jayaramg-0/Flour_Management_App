import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form, Badge, InputGroup } from 'react-bootstrap';
import { ShoppingCart, Plus, Search, Calendar, Filter, RefreshCcw, User, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { salesService, productService, userService } from '../../services/api';

const SalesPage = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [summary, setSummary] = useState(null);

    const [saleForm, setSaleForm] = useState({
        product_id: '',
        quantity: 1,
        customer_id: '',
        amount_paid: '',
        payment_method: 'cash',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [salesRes, prodRes, userRes, summaryRes] = await Promise.all([
                salesService.getSales(),
                productService.getProducts(),
                userService.getUsers(),
                salesService.getDailySummary(new Date().toISOString().split('T')[0])
            ]);
            setSales(salesRes.data.results || salesRes.data);
            setProducts(prodRes.data.results || prodRes.data);
            setCustomers((userRes.data.results || userRes.data).filter(u => u.role === 'customer'));
            setSummary(summaryRes.data);
        } catch (error) {
            toast.error("Failed to load sales data");
        } finally {
            setLoading(false);
        }
    };

    const handleSaleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...saleForm };
            // Convert empty strings to null for backend
            if (!data.customer_id) data.customer_id = null;
            if (data.amount_paid === '') data.amount_paid = null;

            await salesService.createSale(data);
            toast.success("Sale recorded successfully");
            setShowSaleModal(false);
            setSaleForm({
                product_id: '', quantity: 1, customer_id: '',
                amount_paid: '', payment_method: 'cash', notes: ''
            });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to record sale");
        }
    };

    const getProductPrice = (id) => {
        const p = products.find(p => p.id === parseInt(id));
        return p ? p.price : 0;
    };

    const totalAmount = saleForm.product_id ? (getProductPrice(saleForm.product_id) * saleForm.quantity).toFixed(2) : '0.00';

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Sales Tracking 🛒</h2>
                    <p className="text-muted mb-0">Record and monitor all shop transactions.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="p-2 rounded-3" onClick={fetchData}>
                        <RefreshCcw size={20} />
                    </Button>
                    <Button variant="primary" className="d-flex align-items-center gap-2 rounded-3 px-4 shadow-sm" onClick={() => setShowSaleModal(true)}>
                        <Plus size={20} /> Record New Sale
                    </Button>
                </div>
            </div>

            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 text-center">
                        <h6 className="text-muted small fw-bold mb-2">TODAY'S REVENUE</h6>
                        <h3 className="fw-bold text-primary mb-0">₹{summary?.total_revenue || 0}</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 text-center">
                        <h6 className="text-muted small fw-bold mb-2">TODAY'S PROFIT</h6>
                        <h3 className="fw-bold text-success mb-0">₹{summary?.total_profit || 0}</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 text-center">
                        <h6 className="text-muted small fw-bold mb-2">TOTAL TRANSACTIONS</h6>
                        <h3 className="fw-bold text-info mb-0">{summary?.total_sales || 0}</h3>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <h5 className="fw-bold mb-0">Recent Transactions</h5>
                    <div className="d-flex gap-2">
                        <InputGroup size="sm" style={{ width: '250px' }}>
                            <InputGroup.Text className="bg-light border-0"><Search size={16} /></InputGroup.Text>
                            <Form.Control placeholder="Search transactions..." className="bg-light border-0 shadow-none" />
                        </InputGroup>
                    </div>
                </div>
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="py-3">Product</th>
                            <th className="py-3">Qty</th>
                            <th className="py-3">Unit Price</th>
                            <th className="py-3">Total</th>
                            <th className="py-3">Customer</th>
                            <th className="py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td className="px-4 small text-muted">#{sale.id}</td>
                                <td className="fw-bold">{sale.product_name}</td>
                                <td>{sale.quantity}</td>
                                <td>₹{sale.unit_price}</td>
                                <td className="fw-bold text-primary">₹{sale.total_amount}</td>
                                <td>{sale.customer_name || <span className="text-muted italic smaller">Walk-in</span>}</td>
                                <td className="small text-muted">{new Date(sale.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Sale Modal */}
            <Modal show={showSaleModal} onHide={() => setShowSaleModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Record New Sale</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaleSubmit}>
                    <Modal.Body className="p-4">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Select Product</Form.Label>
                                    <Form.Select
                                        value={saleForm.product_id}
                                        onChange={(e) => setSaleForm({ ...saleForm, product_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose product...</option>
                                        {products.filter(p => p.is_active).map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Quantity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={saleForm.quantity}
                                        onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Customer (Optional)</Form.Label>
                            <Form.Select
                                value={saleForm.customer_id}
                                onChange={(e) => setSaleForm({ ...saleForm, customer_id: e.target.value })}
                            >
                                <option value="">Walk-in Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.username})</option>
                                ))}
                            </Form.Select>
                            <Form.Text className="text-muted">Select a customer to track debt for partial payments.</Form.Text>
                        </Form.Group>

                        {saleForm.customer_id && (
                            <Row className="bg-light p-3 rounded-3 mb-3 border">
                                <Col md={6}>
                                    <Form.Group className="mb-0">
                                        <Form.Label className="fw-semibold">Amount Paid (₹)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder={totalAmount}
                                            value={saleForm.amount_paid}
                                            onChange={(e) => setSaleForm({ ...saleForm, amount_paid: e.target.value })}
                                        />
                                        <Form.Text className="text-muted">Leave blank for full payment.</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-0">
                                        <Form.Label className="fw-semibold">Payment Method</Form.Label>
                                        <Form.Select
                                            value={saleForm.payment_method}
                                            onChange={(e) => setSaleForm({ ...saleForm, payment_method: e.target.value })}
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="upi">UPI</option>
                                            <option value="card">Card</option>
                                            <option value="other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={saleForm.notes}
                                onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })}
                                placeholder="Any special remarks..."
                            />
                        </Form.Group>

                        <div className="bg-primary text-white p-3 rounded-3 d-flex justify-content-between align-items-center shadow-sm">
                            <span className="fw-bold h5 mb-0">Total Amount:</span>
                            <span className="fw-bold h4 mb-0">₹{totalAmount}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowSaleModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4 py-2 fw-bold shadow-sm">Confirm Sale</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout>
    );
};

export default SalesPage;
