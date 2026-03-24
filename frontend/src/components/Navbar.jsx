import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Bell, ShoppingBasket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <Navbar expand="lg" className="glass-card mb-4 border-0 shadow-sm mx-3 mt-3 px-3 py-2 sticky-top">
            <Container fluid>
                <Navbar.Brand className="fw-bold d-flex align-items-center gap-2">
                    <div className="bg-primary p-2 rounded-3 shadow-sm">
                        <ShoppingBasket size={20} color="white" />
                    </div>
                    <span className="d-none d-sm-inline">Flour Shop</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center gap-3">
                        <Nav.Link className="d-flex align-items-center gap-2 position-relative">
                            <Bell size={20} className="text-muted" />
                            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle">
                                <span className="visually-hidden">unread messages</span>
                            </Badge>
                        </Nav.Link>

                        <Nav.Link as={Link} to="/profile" className="d-flex align-items-center gap-2">
                            <div className="bg-light p-2 rounded-circle border border-primary">
                                <UserIcon size={18} className="text-primary" />
                            </div>
                            <div className="d-none d-md-block text-start">
                                <div className="fw-bold small">{user?.first_name || user?.username}</div>
                                <div className="text-muted smaller" style={{ fontSize: '0.75rem' }}>
                                    {user?.role?.toUpperCase()}
                                </div>
                            </div>
                        </Nav.Link>

                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={logout}
                            className="d-flex align-items-center gap-2 border-0 bg-light-danger hover-shadow"
                        >
                            <LogOut size={16} />
                            <span className="d-none d-lg-inline">Logout</span>
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
