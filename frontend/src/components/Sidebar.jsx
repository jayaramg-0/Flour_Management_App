import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Users, CreditCard,
    MessageSquare, Settings, TrendingUp, History
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const isOwner = user?.role === 'owner';

    const ownerLinks = [
        { to: '/owner/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/owner/inventory', icon: <Package size={20} />, label: 'Stock' },
        { to: '/owner/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
        { to: '/owner/profit-loss', icon: <TrendingUp size={20} />, label: 'Profit & Loss' },
        { to: '/owner/debts', icon: <CreditCard size={20} />, label: 'Debts' },
        { to: '/owner/users', icon: <Users size={20} />, label: 'Users' },
        { to: '/owner/feedback', icon: <MessageSquare size={20} />, label: 'Feedback' },
    ];

    const customerLinks = [
        { to: '/customer/dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
        { to: '/customer/reserve', icon: <Package size={20} />, label: 'Pre-book' },
        { to: '/customer/history', icon: <History size={20} />, label: 'History' },
        { to: '/customer/feedback', icon: <MessageSquare size={20} />, label: 'Feedback' },
    ];

    const links = isOwner ? ownerLinks : customerLinks;

    return (
        <div className="sidebar glass-card h-100 p-3 shadow-none border-0 rounded-4">
            <Nav className="flex-column gap-2">
                {links.map((link) => (
                    <Nav.Link
                        key={link.to}
                        as={NavLink}
                        to={link.to}
                        className={({ isActive }) =>
                            `sidebar-link d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'text-muted hover-bg-light'
                            }`
                        }
                    >
                        {link.icon}
                        <span className="fw-semibold">{link.label}</span>
                    </Nav.Link>
                ))}
            </Nav>
        </div>
    );
};

export default Sidebar;
