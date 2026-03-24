import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';
import { MessageSquare, Star, Send, ThumbsUp, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { feedbackService } from '../../services/api';

const FeedbackPage = () => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await feedbackService.submitFeedback({ rating, comment });
            toast.success("Thank you for your feedback!");
            setSubmitted(true);
        } catch (error) {
            toast.error("Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Layout>
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center animate-fade-in">
                        <div className="bg-success bg-opacity-10 p-4 rounded-circle d-inline-block mb-4">
                            <ThumbsUp size={64} className="text-success" />
                        </div>
                        <h2 className="fw-bold mb-2">Feedback Received!</h2>
                        <p className="text-muted mb-4">We truly appreciate you taking the time to share your experience.</p>
                        <Button onClick={() => setSubmitted(false)} variant="primary" className="rounded-pill px-5">Submit Another</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Customer Feedback 💬</h2>
                <p className="text-muted">Rate our service and help us grow.</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={6}>
                    <Card className="border-0 shadow-lg rounded-4 p-5 glass-card text-center">
                        <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-4">
                            <MessageSquare size={32} className="text-warning" />
                        </div>
                        <h4 className="fw-bold mb-4">How was your experience?</h4>

                        <div className="d-flex justify-content-center gap-3 mb-5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setRating(s)}
                                    className="btn p-0 border-0 shadow-none transition-all hover-scale"
                                >
                                    <Star
                                        size={40}
                                        fill={s <= rating ? "#f59e0b" : "none"}
                                        color={s <= rating ? "#f59e0b" : "#cbd5e1"}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            ))}
                        </div>

                        <Form onSubmit={handleSubmit} className="text-start">
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold small text-muted">YOUR COMMENTS</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Tell us what you liked or how we can improve..."
                                    className="bg-light border-0 p-3 rounded-3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-100 py-3 fw-bold rounded-3 shadow d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : <><Send size={18} /> Submit Feedback</>}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default FeedbackPage;
