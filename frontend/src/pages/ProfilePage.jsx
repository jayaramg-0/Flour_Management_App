import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert, Badge, InputGroup } from 'react-bootstrap';
import { User as UserIcon, Mail, Phone, Lock, Save, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

const ProfilePage = () => {
    const { user, refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.updateUser(user.id, formData);
            await refreshUser();
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">My Profile 👤</h2>
                <p className="text-muted">Manage your personal information and account settings.</p>
            </div>

            <Row>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 mb-4">
                        <div className="position-relative d-inline-block mx-auto mb-3">
                            <div className="bg-primary bg-opacity-10 p-4 rounded-circle border border-primary border-2">
                                <UserIcon size={64} className="text-primary" />
                            </div>
                            <Button size="sm" variant="primary" className="position-absolute bottom-0 end-0 rounded-circle p-2 shadow">
                                <Camera size={16} />
                            </Button>
                        </div>
                        <h4 className="fw-bold mb-0">{user?.first_name} {user?.last_name}</h4>
                        <p className="text-muted small">@{user?.username}</p>
                        <Badge bg={user?.role === 'owner' ? 'primary' : 'success'} className="rounded-pill px-3">
                            {user?.role?.toUpperCase()}
                        </Badge>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 p-4 text-start">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <Lock size={18} className="text-muted" /> Security
                        </h6>
                        <p className="small text-muted mb-4">To change your password, please contact the shop administrator or use the password reset flow.</p>
                        <Button variant="outline-primary" className="w-100 rounded-3 small fw-bold">Request Password Reset</Button>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Personal Details</h5>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small text-muted">FIRST NAME</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="bg-light border-0 p-3 rounded-3"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold small text-muted">LAST NAME</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="bg-light border-0 p-3 rounded-3"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-muted">EMAIL ADDRESS</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-0 border-end-0"><Mail size={18} /></InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-light border-0 border-start-0 p-3 rounded-3"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold small text-muted">PHONE NUMBER</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-0 border-end-0"><Phone size={18} /></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="bg-light border-0 border-start-0 p-3 rounded-3"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <hr className="my-4 opacity-10" />

                            <div className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="px-5 py-2 fw-bold rounded-3 shadow d-flex align-items-center gap-2"
                                    disabled={loading}
                                >
                                    <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default ProfilePage;
