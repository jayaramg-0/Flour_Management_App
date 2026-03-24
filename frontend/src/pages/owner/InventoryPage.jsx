import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { Package, Plus, Edit, Trash2, AlertTriangle, RefreshCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { productService, inventoryService } from '../../services/api';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showProductModal, setShowProductModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedInventory, setSelectedInventory] = useState(null);

    const [productForm, setProductForm] = useState({
        name: '', price: '', cost_price: '', description: '', is_active: true
    });

    const [stockForm, setStockForm] = useState({
        quantity: '', action: 'add'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, invRes] = await Promise.all([
                productService.getProducts(),
                inventoryService.getInventory()
            ]);
            setProducts(prodRes.data.results || prodRes.data);
            setInventory(invRes.data.results || invRes.data);
        } catch (error) {
            toast.error("Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, productForm);
                toast.success("Product updated successfully");
            } else {
                await productService.createProduct(productForm);
                toast.success("Product created successfully");
            }
            setShowProductModal(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to save product");
        }
    };

    const handleStockSubmit = async (e) => {
        e.preventDefault();
        try {
            await inventoryService.updateStock(selectedInventory.id, {
                quantity: parseInt(stockForm.quantity),
                action: stockForm.action
            });
            toast.success("Stock updated successfully");
            setShowStockModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update stock");
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(id);
                toast.success("Product deleted");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    const openProductModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name,
                price: product.price,
                cost_price: product.cost_price,
                description: product.description || '',
                is_active: product.is_active
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                name: '', price: '', cost_price: '', description: '', is_active: true
            });
        }
        setShowProductModal(true);
    };

    const openStockModal = (inv) => {
        setSelectedInventory(inv);
        setStockForm({ quantity: '', action: 'add' });
        setShowStockModal(true);
    };

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Inventory Management 📦</h2>
                    <p className="text-muted mb-0">Manage your products and track stock levels.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" className="p-2 rounded-3" onClick={fetchData}>
                        <RefreshCcw size={20} />
                    </Button>
                    <Button variant="primary" className="d-flex align-items-center gap-2 rounded-3 px-4 shadow-sm" onClick={() => openProductModal()}>
                        <Plus size={20} /> Add Product
                    </Button>
                </div>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="py-3">Price</th>
                            <th className="py-3">Cost Price</th>
                            <th className="py-3">Current Stock</th>
                            <th className="py-3">Status</th>
                            <th className="px-4 py-3 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 fw-bold text-main">{item.product_name}</td>
                                <td><Badge bg="primary" className="rounded-pill px-3">₹{item.product_price}</Badge></td>
                                <td className="text-muted">₹{products.find(p => p.id === item.product)?.cost_price || '--'}</td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className={`fw-bold ${item.is_low_stock ? 'text-danger' : 'text-main'}`}>
                                            {item.quantity} units
                                        </span>
                                        {item.is_low_stock && <AlertTriangle size={16} className="text-danger" />}
                                    </div>
                                </td>
                                <td>
                                    <Badge bg={products.find(p => p.id === item.product)?.is_active ? "success" : "secondary"} className="rounded-pill">
                                        {products.find(p => p.id === item.product)?.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td className="px-4 text-end">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <Button variant="light" size="sm" className="rounded-2 text-primary border-primary-light" onClick={() => openStockModal(item)} title="Update Stock">
                                            <RefreshCcw size={16} />
                                        </Button>
                                        <Button variant="light" size="sm" className="rounded-2 text-info" onClick={() => openProductModal(products.find(p => p.id === item.product))} title="Edit Product">
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="light" size="sm" className="rounded-2 text-danger" onClick={() => deleteProduct(item.product)} title="Delete Product">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Product Modal */}
            <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleProductSubmit}>
                    <Modal.Body className="p-4">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. ₹20 Flour Packet"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Selling Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Cost Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        value={productForm.cost_price}
                                        onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Check
                            type="switch"
                            label="Product is active"
                            checked={productForm.is_active}
                            onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                            className="fw-semibold"
                        />
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowProductModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4">
                            {editingProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Stock Modal */}
            <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Update Stock</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleStockSubmit}>
                    <Modal.Body className="p-4">
                        <p className="small text-muted mb-3">Updating stock for <strong>{selectedInventory?.product_name}</strong></p>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Action</Form.Label>
                            <Form.Select
                                value={stockForm.action}
                                onChange={(e) => setStockForm({ ...stockForm, action: e.target.value })}
                            >
                                <option value="add">Add Units</option>
                                <option value="remove">Remove Units</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={stockForm.quantity}
                                onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="light" onClick={() => setShowStockModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" className="px-4">Update</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Layout>
    );
};

export default InventoryPage;
