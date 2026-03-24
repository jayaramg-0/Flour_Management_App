import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AppNavbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="layout-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppNavbar />
            <Container fluid className="flex-grow-1 px-4 mb-4">
                <Row className="h-100">
                    <Col lg={2} className="d-none d-lg-block mb-4 h-100 sticky-top" style={{ top: '100px', height: 'fit-content' }}>
                        <Sidebar />
                    </Col>
                    <Col lg={10} xs={12}>
                        <div className="animate-fade-in dashboard-content">
                            {children}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Layout;
