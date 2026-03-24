import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'customer'
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirm) {
            return toast.error("Passwords don't match!");
        }

        setLoading(true);
        try {
            const response = await authService.register(formData);
            const { user, tokens } = response.data;
            login(user, tokens);
            toast.success(`Account created! Welcome, ${user.first_name || user.username}!`);

            if (user.role === 'owner') {
                navigate('/owner/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (error) {
            const errors = error.response?.data;
            if (typeof errors === 'object') {
                Object.values(errors).forEach(err => toast.error(Array.isArray(err) ? err[0] : err));
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="glass-card animate-fade-in p-4 shadow-lg border-0">
                        <div className="text-center mb-4">
                            <div className="bg-success d-inline-block p-3 rounded-circle mb-3 shadow">
                                <UserPlus size={32} color="white" />
                            </div>
                            <h2 className="fw-bold">Create Account</h2>
                            <p className="text-muted">Join the Flour Shop community today</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            placeholder="John"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            placeholder="Doe"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Username</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <UserIcon size={18} color="#64748b" />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="johndoe123"
                                        className="bg-light border-start-0"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Email Address</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <Mail size={18} color="#64748b" />
                                    </span>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        className="bg-light border-start-0"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Phone Number</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0">
                                        <Phone size={18} color="#64748b" />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        placeholder="9876543210"
                                        className="bg-light border-start-0"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Password</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Lock size={18} color="#64748b" />
                                            </span>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                className="bg-light border-start-0"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Lock size={18} color="#64748b" />
                                            </span>
                                            <Form.Control
                                                type="password"
                                                name="password_confirm"
                                                placeholder="••••••••"
                                                className="bg-light border-start-0"
                                                value={formData.password_confirm}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">I am a...</Form.Label>
                                <div className="d-flex gap-3">
                                    <Button
                                        variant={formData.role === 'customer' ? 'secondary' : 'outline-secondary'}
                                        onClick={() => setFormData({ ...formData, role: 'customer' })}
                                        className="flex-fill shadow-sm"
                                    >
                                        Customer
                                    </Button>
                                    <Button
                                        variant={formData.role === 'owner' ? 'secondary' : 'outline-secondary'}
                                        onClick={() => setFormData({ ...formData, role: 'owner' })}
                                        className="flex-fill shadow-sm"
                                    >
                                        Owner
                                    </Button>
                                </div>
                            </Form.Group>

                            <Button
                                variant="success"
                                type="submit"
                                className="w-100 py-2 mb-3 shadow btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <p className="mb-0 text-muted">
                                Already have an account? <Link to="/login" className="text-success fw-semibold text-decoration-none">Log in</Link>
                            </p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignupPage;
