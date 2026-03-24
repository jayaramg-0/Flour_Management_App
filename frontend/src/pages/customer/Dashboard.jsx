import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import {
    ShoppingBag, Clock, CreditCard, Star,
    ArrowRight, Package, Calendar, AlertCircle, ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { reservationService, paymentService, salesService } from '../../services/api';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pending_reservations: 0,
        outstanding_debt: 0,
        total_purchases: 0
    });
    const [recentReservations, setRecentReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [resvRes, debtRes, salesRes] = await Promise.all([
                reservationService.getReservations(),
                paymentService.getDebts(false), // get personal debts
                salesService.getSales() // get personal sales
            ]);

            const activeResv = (resvRes.data.results || resvRes.data).filter(r => r.status === 'pending' || r.status === 'confirmed');
            const debt = (debtRes.data.results || debtRes.data).reduce((acc, curr) => acc + parseFloat(curr.remaining_amount), 0);
            const totalSales = (salesRes.data.results || salesRes.data).length;

            setStats({
                pending_reservations: activeResv.length,
                outstanding_debt: debt,
                total_purchases: totalSales
            });

            setRecentReservations((resvRes.data.results || resvRes.data).slice(0, 5));
        } catch (error) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Welcome, {user?.first_name || user?.username}! ✨</h2>
                <p className="text-muted">Manage your pre-bookings and track your purchase history.</p>
            </div>

            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="p-3 bg-white bg-opacity-25 rounded-3">
                                <Clock size={24} />
                            </div>
                        </div>
                        <h6 className="opacity-75 small fw-bold mb-1">ACTIVE RESERVATIONS</h6>
                        <h2 className="fw-bold mb-0">{stats.pending_reservations}</h2>
                        <Link to="/customer/reserve" className="text-white small mt-3 d-inline-flex align-items-center gap-1 text-decoration-none opacity-75 hover-opacity-100">
                            New Pre-booking <ArrowRight size={14} />
                        </Link>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-danger text-white">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="p-3 bg-white bg-opacity-25 rounded-3">
                                <CreditCard size={24} />
                            </div>
                        </div>
                        <h6 className="opacity-75 small fw-bold mb-1">OUTSTANDING BALANCE</h6>
                        <h2 className="fw-bold mb-0">₹{stats.outstanding_debt.toFixed(2)}</h2>
                        <Link to="/customer/history" className="text-white small mt-3 d-inline-flex align-items-center gap-1 text-decoration-none opacity-75 hover-opacity-100">
                            View Ledger <ArrowRight size={14} />
                        </Link>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-success text-white">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="p-3 bg-white bg-opacity-25 rounded-3">
                                <ShoppingBag size={24} />
                            </div>
                        </div>
                        <h6 className="opacity-75 small fw-bold mb-1">TOTAL PURCHASES</h6>
                        <h2 className="fw-bold mb-0">{stats.total_purchases}</h2>
                        <Link to="/customer/history" className="text-white small mt-3 d-inline-flex align-items-center gap-1 text-decoration-none opacity-75 hover-opacity-100">
                            Order History <ArrowRight size={14} />
                        </Link>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <Card.Header className="bg-white p-4 border-0 pb-0">
                            <h5 className="fw-bold mb-0">Recent Reservations</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="py-3">Quantity</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReservations.map((resv) => (
                                        <tr key={resv.id}>
                                            <td className="px-4 fw-semibold">{resv.product_name}</td>
                                            <td>{resv.quantity} units</td>
                                            <td>
                                                <Badge bg={
                                                    resv.status === 'pending' ? 'warning' :
                                                        resv.status === 'confirmed' ? 'info' :
                                                            resv.status === 'completed' ? 'success' : 'danger'
                                                } className="rounded-pill">
                                                    {resv.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="small text-muted">{new Date(resv.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {recentReservations.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted">
                                                No active reservations.
                                                <br />
                                                <Link to="/customer/reserve" className="btn btn-sm btn-outline-primary mt-2 rounded-pill">Book Now</Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 text-center glass-card">
                        <div className="bg-warning bg-opacity-25 p-3 rounded-circle d-inline-block mb-3">
                            <Star size={32} className="text-warning" />
                        </div>
                        <h5 className="fw-bold">Enjoying our service?</h5>
                        <p className="text-muted small">Your feedback helps us improve our flour quality and shop experience.</p>
                        <Button as={Link} to="/customer/feedback" variant="warning" className="w-100 fw-bold text-white shadow-sm rounded-3">
                            Leave a Review
                        </Button>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-info bg-opacity-25 p-2 rounded-3 text-info">
                                <AlertCircle size={20} />
                            </div>
                            <h6 className="fw-bold mb-0">Quick Tip</h6>
                        </div>
                        <p className="small text-muted mb-0">
                            Reservations are held for 24 hours only. Please visit the shop to collect your packets before they expire!
                        </p>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default CustomerDashboard;
