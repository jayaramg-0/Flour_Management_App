import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, InputGroup, Form, Button, ListGroup } from 'react-bootstrap';
import { History, Search, Filter, RefreshCcw, ShoppingCart, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { salesService, paymentService } from '../../services/api';

const HistoryPage = () => {
    const [sales, setSales] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [salesRes, payRes] = await Promise.all([
                salesService.getSales(),
                paymentService.getPayments()
            ]);
            setSales(salesRes.data.results || salesRes.data);
            setPayments(payRes.data.results || payRes.data);
        } catch (error) {
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Purchase History 📜</h2>
                <p className="text-muted">Track all your previous orders and payments.</p>
            </div>

            <Row className="g-4">
                <Col lg={7}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Order Log</h5>
                            <Button variant="link" size="sm" onClick={fetchData} className="p-0"><RefreshCcw size={16} /></Button>
                        </div>
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="py-3">Qty</th>
                                    <th className="py-3">Total</th>
                                    <th className="py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => (
                                    <tr key={sale.id}>
                                        <td className="px-4 fw-bold">{sale.product_name}</td>
                                        <td>{sale.quantity}</td>
                                        <td className="text-primary fw-bold">₹{sale.total_amount}</td>
                                        <td className="small text-muted">{new Date(sale.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {sales.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-muted">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <div className="p-3 border-bottom bg-success text-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Payment Ledger</h5>
                            <CreditCard size={18} />
                        </div>
                        <ListGroup variant="flush">
                            {payments.map(pay => (
                                <ListGroup.Item key={pay.id} className="p-4 border-0 border-bottom">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <div className="fw-bold text-success">₹{pay.amount} Paid</div>
                                            <div className="small text-muted">via {pay.payment_method.toUpperCase()}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="small text-muted">{new Date(pay.created_at).toLocaleDateString()}</div>
                                            <Badge bg="success-subtle" className="text-success rounded-pill smaller">Success</Badge>
                                        </div>
                                    </div>
                                    {pay.notes && <p className="small text-muted mt-2 mb-0 italic">"{pay.notes}"</p>}
                                </ListGroup.Item>
                            ))}
                            {payments.length === 0 && (
                                <ListGroup.Item className="text-center py-5 text-muted border-0">No payments recorded.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default HistoryPage;
