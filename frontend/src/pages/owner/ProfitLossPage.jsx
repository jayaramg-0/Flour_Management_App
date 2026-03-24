import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { salesService } from '../../services/api';
import { Bar, Line } from 'react-chartjs-2';

const ProfitLossPage = () => {
    const [profitLossData, setProfitLossData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchData();
    }, [days]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await salesService.getProfitLoss(days);
            const data = response.data;
            setProfitLossData(data);

            // Format chart data
            setChartData({
                labels: data.map(item => item.date),
                datasets: [
                    {
                        label: 'Total Revenue (₹)',
                        data: data.map(item => item.revenue),
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.5)',
                        borderWidth: 2,
                        type: 'line',
                        tension: 0.3
                    },
                    {
                        label: 'Total Profit (₹)',
                        data: data.map(item => item.profit),
                        backgroundColor: '#10b981',
                        borderRadius: 6,
                    }
                ]
            });
        } catch (error) {
            toast.error("Failed to load profit & loss data");
        } finally {
            setLoading(false);
        }
    };

    const totals = profitLossData.reduce((acc, curr) => ({
        revenue: acc.revenue + parseFloat(curr.revenue),
        profit: acc.profit + parseFloat(curr.profit),
        sales: acc.sales + curr.sales_count
    }), { revenue: 0, profit: 0, sales: 0 });

    const avgProfitMargin = totals.revenue > 0 ? ((totals.profit / totals.revenue) * 100).toFixed(1) : 0;

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Profit & Loss Report 📈</h2>
                    <p className="text-muted mb-0">Analyze your shop's financial performance over time.</p>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <Form.Select
                        size="sm"
                        className="rounded-3 border-0 shadow-sm px-3"
                        style={{ width: '150px' }}
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="15">Last 15 Days</option>
                        <option value="30">Last 30 Days</option>
                    </Form.Select>
                    <Button variant="outline-primary" className="p-2 rounded-3" onClick={fetchData}>
                        <RefreshCcw size={20} />
                    </Button>
                </div>
            </div>

            <Row className="mb-4 g-3">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 text-center bg-primary text-white">
                        <h6 className="opacity-75 small fw-bold mb-2">PERIOD REVENUE</h6>
                        <h2 className="fw-bold mb-0">₹{totals.revenue.toFixed(2)}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 text-center bg-success text-white">
                        <h6 className="opacity-75 small fw-bold mb-2">PERIOD PROFIT</h6>
                        <h2 className="fw-bold mb-0">₹{totals.profit.toFixed(2)}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4 text-center glass-card">
                        <h6 className="text-muted small fw-bold mb-2">PROFIT MARGIN</h6>
                        <h2 className="fw-bold text-main mb-0">{avgProfitMargin}%</h2>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-4">Financial Trends</h5>
                <div style={{ height: '350px' }}>
                    {chartData ? <Bar data={chartData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} /> : <p>Loading chart...</p>}
                </div>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Daily Breakdown</h5>
                </div>
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="py-3">Sales Count</th>
                            <th className="py-3">Revenue</th>
                            <th className="py-3">Cost</th>
                            <th className="py-3">Profit</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profitLossData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="px-4 fw-bold">{item.date}</td>
                                <td>{item.sales_count}</td>
                                <td className="text-primary fw-semibold">₹{item.revenue}</td>
                                <td className="text-muted">₹{item.cost}</td>
                                <td className="text-success fw-bold">₹{item.profit}</td>
                                <td className="px-4">
                                    {parseFloat(item.profit) > 0 ? (
                                        <Badge bg="success-subtle" className="text-success border border-success-subtle rounded-pill">Good Performance</Badge>
                                    ) : (
                                        <Badge bg="secondary-subtle" className="text-muted border border-secondary-subtle rounded-pill">No Profit</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Layout>
    );
};

export default ProfitLossPage;
