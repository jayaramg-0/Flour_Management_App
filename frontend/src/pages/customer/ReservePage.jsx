import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Badge, InputGroup, Modal } from 'react-bootstrap';
import { Package, Clock, Plus, RefreshCcw, ShoppingCart, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { productService, reservationService } from '../../services/api';

const ReservePage = () => {
    const [products, setProducts] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ product_id: '', quantity: 1 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, resvRes] = await Promise.all([
                productService.getProducts(),
                reservationService.getReservations()
            ]);
            setProducts((prodRes.data.results || prodRes.data).filter(p => p.is_active));
            setReservations(resvRes.data.results || resvRes.data);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await reservationService.createReservation(form);
            toast.success("Pre-booking successful!");
            setShowModal(false);
            setForm({ product_id: '', quantity: 1 });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to make reservation");
        }
    };

    const cancelReservation = async (id) => {
        if (window.confirm("Cancel this reservation?")) {
            try {
                await reservationService.updateAction(id, 'cancel');
                toast.success("Reservation cancelled");
                fetchData();
            } catch (error) {
                toast.error("Failed to cancel");
            }
        }
    };

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Pre-book Flour 📦</h2>
                    <p className="text-muted mb-0">Reserve your packets in advance to avoid stock-outs.</p>
                </div>
                <Button variant="primary" className="d-flex align-items-center gap-2 rounded-3 px-4 shadow-sm" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> New Reservation
                </Button>
            </div>

            <Row className="mb-5">
                <Col lg={8}>
                    <h5 className="fw-bold mb-3">Your Reservations</h5>
                    <div className="row g-3">
                        {reservations.map(resv => (
                            <Col md={12} key={resv.id}>
                                <Card className="border-0 shadow-sm rounded-4 p-3 transition-all">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className={`p-3 rounded-3 bg-light text-primary`}>
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-0">{resv.product_name}</h6>
                                                <p className="text-muted small mb-0">{resv.quantity} packets • ₹{resv.total_amount}</p>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Badge bg={
                                                resv.status === 'pending' ? 'warning' :
                                                    resv.status === 'confirmed' ? 'info' :
                                                        resv.status === 'completed' ? 'success' : 'danger'
                                            } className="rounded-pill mb-2 px-3">
                                                {resv.status.toUpperCase()}
                                            </Badge>
                                            <br />
                                            {resv.status === 'pending' && (
                                                <Button variant="link" size="sm" className="text-danger p-0 fw-bold text-decoration-none" onClick={() => cancelReservation(resv.id)}>
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                        {reservations.length === 0 && (
                            <Col md={12}>
                                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                                    <Clock size={48} className="text-muted opacity-25 mb-3" />
                                    <p className="text-muted">No reservations yet.</p>
                                </div>
                            </Col>
                        )}
                    </div>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                        <h5 className="fw-bold mb-3">Available Products</h5>
                        <div className="d-flex flex-column gap-3">
                            {products.map(p => (
                                <div key={p.id} className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light">
                                    <div>
                                        <h6 className="fw-bold mb-0 small">{p.name}</h6>
                                        <p className="text-primary fw-bold mb-0 small">₹{p.price}</p>
                                    </div>
                                    <Button variant="primary" size="sm" className="rounded-pill px-3 shadow-none" onClick={() => {
                                        setForm({ product_id: p.id, quantity: 1 });
                                        setShowModal(true);
                                    }}>
                                        Book
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">New Pre-booking</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="p-4 pt-0">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Select Product</Form.Label>
                            <Form.Select
                                value={form.product_id}
                                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                                required
                            >
                                <option value="">Choose...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Quantity (Packets)</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="10"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                required
                            />
                            <Form.Text className="text-muted">Maximum 10 packets per reservation.</Form.Text>
                        </Form.Group>

                        <div className="bg-info bg-opacity-10 p-3 rounded-3 d-flex align-items-start gap-2 border border-info border-opacity-25">
                            <AlertCircle size={18} className="text-info mt-1" />
                            <p className="small text-info mb-0 fw-semibold">
                                By clicking confirm, you agree to collect your reservation within 24 hours. Uncollected orders will be cancelled.
                            </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4 shadow">Confirm Reservation</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout>
    );
};

export default ReservePage;
