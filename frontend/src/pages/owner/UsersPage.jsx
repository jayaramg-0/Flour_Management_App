import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import { Users, Search, RefreshCcw, UserPlus, Mail, Phone, Shield, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { userService } from '../../services/api';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers();
            setUsers(response.data.results || response.data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">User Management 👥</h2>
                    <p className="text-muted mb-0">View and manage shop customers and staff.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="p-2 rounded-3" onClick={fetchData}>
                        <RefreshCcw size={20} />
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <h5 className="fw-bold mb-0">System Users</h5>
                    <InputGroup size="sm" style={{ width: '300px' }}>
                        <InputGroup.Text className="bg-light border-0"><Search size={16} /></InputGroup.Text>
                        <Form.Control
                            placeholder="Search by name, email or username..."
                            className="bg-light border-0 shadow-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Full Name</th>
                            <th className="py-3">Role</th>
                            <th className="py-3">Contact Info</th>
                            <th className="py-3">Joined Date</th>
                            <th className="px-4 py-3 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className={`p-2 rounded-circle ${user.role === 'owner' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <div className="fw-bold">{user.first_name} {user.last_name}</div>
                                            <div className="text-muted small">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <Badge bg={user.role === 'owner' ? 'primary' : 'success'} className="rounded-pill px-3">
                                        {user.role.toUpperCase()}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="small d-flex flex-column">
                                        <span className="d-flex align-items-center gap-1"><Mail size={12} /> {user.email}</span>
                                        {user.phone && <span className="d-flex align-items-center gap-1"><Phone size={12} /> {user.phone}</span>}
                                    </div>
                                </td>
                                <td className="small text-muted">{new Date(user.date_joined).toLocaleDateString()}</td>
                                <td className="px-4 text-end">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <Button variant="light" size="sm" className="rounded-2 text-info" title="View Profile">
                                            <Edit size={16} />
                                        </Button>
                                        {user.role !== 'owner' && (
                                            <Button variant="light" size="sm" className="rounded-2 text-danger" title="Disable User">
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Layout>
    );
};

export default UsersPage;
