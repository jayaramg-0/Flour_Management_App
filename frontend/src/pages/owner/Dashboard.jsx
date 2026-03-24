import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import {
    TrendingUp, ShoppingBag, Package, Users,
    ArrowUpRight, ArrowDownRight, RefreshCcw,
    Store, StoreOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { salesService, inventoryService, shopService, analyticsService } from '../../services/api';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const OwnerDashboard = () => {
    const [summary, setSummary] = useState({
        total_sales: 0,
        total_revenue: 0,
        total_profit: 0,
        total_quantity: 0
    });
    const [shopStatus, setShopStatus] = useState(null);
    const [salesChartData, setSalesChartData] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [summaryRes, statusRes, salesDataRes, compRes] = await Promise.all([
                salesService.getDailySummary(new Date().toISOString().split('T')[0]),
                shopService.getStatus(),
                analyticsService.getSalesData(7),
                analyticsService.getComparisonData(7)
            ]);

            setSummary(summaryRes.data);
            setShopStatus(statusRes.data);

            // Format chart data
            setSalesChartData({
                labels: salesDataRes.data.labels,
                datasets: [
                    {
                        label: 'Revenue (₹)',
                        data: salesDataRes.data.revenue,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        tension: 0.4,
                        fill: true,
                    }
                ]
            });

            setComparisonData({
                labels: compRes.data.labels,
                datasets: [
                    {
                        label: 'Packets Sold',
                        data: compRes.data.quantities,
                        backgroundColor: ['#4f46e5', '#10b981'],
                        borderWidth: 0,
                    }
                ]
            });

        } catch (error) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const toggleShop = async () => {
        try {
            const response = await shopService.toggleStatus(!shopStatus.is_open);
            setShopStatus(response.data);
            toast.success(`Shop is now ${response.data.is_open ? 'OPEN' : 'CLOSED'}`);
        } catch (error) {
            toast.error("Failed to toggle shop status");
        }
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
        <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                    <div className={`stat-icon bg-light-${color} text-${color}`}>
                        {icon}
                    </div>
                    {trend && (
                        <div className={`text-${trend > 0 ? 'success' : 'danger'} small fw-bold d-flex align-items-center`}>
                            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <h6 className="text-muted fw-semibold mb-1">{title}</h6>
                <h3 className="fw-bold mb-0">{value}</h3>
            </Card.Body>
        </Card>
    );

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Hello, Owner! 👋</h2>
                    <p className="text-muted mb-0">Here's what's happening in your shop today.</p>
                </div>
                <div className="d-flex gap-3">
                    <Button
                        variant={shopStatus?.is_open ? "success" : "danger"}
                        className="d-flex align-items-center gap-2 shadow-sm rounded-3 px-4 fw-bold"
                        onClick={toggleShop}
                    >
                        {shopStatus?.is_open ? <Store size={20} /> : <StoreOff size={20} />}
                        {shopStatus?.is_open ? "Shop Open" : "Shop Closed"}
                    </Button>
                    <Button variant="outline-primary" className="p-2 rounded-3 shadow-sm" onClick={fetchDashboardData}>
                        <RefreshCcw size={20} />
                    </Button>
                </div>
            </div>

            <Row className="mb-4 g-3">
                <Col md={3}>
                    <StatCard
                        title="Today's Sales"
                        value={summary.total_sales || 0}
                        icon={<ShoppingBag size={24} />}
                        color="primary"
                        trend={12}
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title="Today's Revenue"
                        value={`₹${summary.total_revenue || 0}`}
                        icon={<TrendingUp size={24} />}
                        color="success"
                        trend={8}
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title="Today's Profit"
                        value={`₹${summary.total_profit || 0}`}
                        icon={<TrendingUp size={24} />}
                        color="warning"
                        trend={5}
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title="Packets Sold"
                        value={summary.total_quantity || 0}
                        icon={<Package size={24} />}
                        color="info"
                    />
                </Col>
            </Row>

            <Row className="mb-4 g-3">
                <Col lg={8}>
                    <Card className="h-100 border-0 shadow-sm p-4 rounded-4">
                        <h5 className="fw-bold mb-4">Revenue Trend (Last 7 Days)</h5>
                        <div style={{ height: '300px' }}>
                            {salesChartData ? <Line data={salesChartData} options={{ maintainAspectRatio: false }} /> : <p>Loading chart...</p>}
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="h-100 border-0 shadow-sm p-4 rounded-4">
                        <h5 className="fw-bold mb-4">Packet Sales Comparison</h5>
                        <div style={{ height: '300px' }} className="d-flex align-items-center justify-content-center">
                            {comparisonData ? <Doughnut data={comparisonData} options={{ maintainAspectRatio: false }} /> : <p>Loading chart...</p>}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default OwnerDashboard;
