import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Form, InputGroup, Col } from 'react-bootstrap';
import { MessageSquare, Star, Search, RefreshCcw, User as UserIcon, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { feedbackService } from '../../services/api';

const FeedbackPage = () => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await feedbackService.getFeedback();
            setFeedback(response.data.results || response.data);
        } catch (error) {
            toast.error("Failed to load feedback");
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < rating ? "#f59e0b" : "none"}
                color={i < rating ? "#f59e0b" : "#cbd5e1"}
            />
        ));
    };

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Customer Feedback 💬</h2>
                    <p className="text-muted mb-0">Hear what your customers are saying about your service.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="p-2 rounded-3" onClick={fetchData}>
                        <RefreshCcw size={20} />
                    </Button>
                </div>
            </div>

            <div className="row g-4">
                {feedback.map((item) => (
                    <Col lg={4} md={6} key={item.id}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 transition-all hover-translate">
                            <Card.Body className="p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="bg-light p-2 rounded-circle">
                                            <UserIcon size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{item.user_name}</div>
                                            <div className="text-muted smaller" style={{ fontSize: '0.7rem' }}>
                                                <Calendar size={10} /> {new Date(item.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-1">
                                        {renderStars(item.rating)}
                                    </div>
                                </div>

                                <div className="flex-grow-1">
                                    <p className="text-main mb-0 fst-italic">"{item.comment}"</p>
                                </div>

                                <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                                    <Badge bg="success-subtle" className="text-success rounded-pill px-3 py-1">Verified Customer</Badge>
                                    <Button variant="link" size="sm" className="text-primary text-decoration-none fw-bold p-0">Reply</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                {feedback.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <MessageSquare size={48} className="text-muted opacity-25 mb-3" />
                        <p className="text-muted">No feedback received yet.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default FeedbackPage;
