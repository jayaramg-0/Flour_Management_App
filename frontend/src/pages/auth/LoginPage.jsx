import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            const { user, tokens } = response.data;
            login(user, tokens);
            toast.success(`Welcome back, ${user.first_name || user.username}!`);

            if (user.role === 'owner') {
                navigate('/owner/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={5} lg={4}>
                    <Card className="glass-card animate-fade-in p-4 shadow-lg border-0">
                        <div className="text-center mb-4">
                            <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow">
                                <LogIn size={32} color="white" />
                            </div>
                            <h2 className="fw-bold">Flour Shop</h2>
                            <p className="text-muted">Enter your credentials to access the shop</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Email Address</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <Mail size={18} color="#64748b" />
                                    </span>
                                    <Form.Control
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-light border-start-0"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <Lock size={18} color="#64748b" />
                                    </span>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        className="bg-light border-start-0"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 py-2 mb-3 shadow"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <p className="mb-0 text-muted">
                                Don't have an account? <Link to="/signup" className="text-primary fw-semibold text-decoration-none">Sign up</Link>
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
