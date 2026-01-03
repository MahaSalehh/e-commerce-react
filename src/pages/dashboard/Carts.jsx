import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaEye, FaShoppingCart } from "react-icons/fa";
import { cartsAPI, usersAPI, productsAPI } from "../../service/api";
import PaginationComponent from "../../components/PaginationComponent";
const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    products: [{ id: "", quantity: 1 }],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCarts, setTotalCarts] = useState(0);
    const [cartsPerPage, setCartsPerPage] = useState(12);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setCartsPerPage(6);
      } else {
        setCartsPerPage(12);
      }
      setCurrentPage(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);
  useEffect(() => {
    fetchCarts();
  }, [currentPage, cartsPerPage]);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * cartsPerPage;
      const response = await cartsAPI.getAll({ limit: cartsPerPage, skip });
      setCarts(response.data.carts);
      setTotalCarts(response.data.total);
    } catch (error) {
      console.error("Failed to fetch carts:", error);
      showAlert("Failed to fetch carts", "danger");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll({ limit: 100 });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 100 });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const handleViewCart = async (cart) => {
    try {
      const response = await cartsAPI.getById(cart.id);
      setSelectedCart(response.data);
      setShowDetailModal(true);
    } catch (error) {
      showAlert("Failed to fetch cart details", "danger");
    }
  };

  const handleAddCart = () => {
    setModalMode("add");
    setFormData({
      userId: "",
      products: [{ id: "", quantity: 1 }],
    });
    setShowModal(true);
  };

  const handleEditCart = (cart) => {
    setModalMode("edit");
    setSelectedCart(cart);
    setFormData({
      userId: cart.userId,
      products: cart.products.map((p) => ({ id: p.id, quantity: p.quantity })),
    });
    setShowModal(true);
  };

  const handleDeleteCart = async (id) => {
    if (window.confirm("Are you sure you want to delete this cart?")) {
      try {
        await cartsAPI.delete(id);
        showAlert("Cart deleted successfully", "success");
        fetchCarts();
      } catch (error) {
        showAlert("Failed to delete cart", "danger");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await cartsAPI.add(formData);
        showAlert("Cart added successfully", "success");
      } else {
        await cartsAPI.update(selectedCart.id, formData);
        showAlert("Cart updated successfully", "success");
      }
      setShowModal(false);
      fetchCarts();
    } catch (error) {
      showAlert(`Failed to ${modalMode} cart`, "danger");
    }
  };

  const addProductToForm = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { id: "", quantity: 1 }],
    });
  };

  const removeProductFromForm = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const updateFormProduct = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = field === "quantity" ? parseInt(value) : value;
    setFormData({ ...formData, products: newProducts });
  };

  const totalPages = Math.ceil(totalCarts / cartsPerPage);

  return (
    <Container fluid className="py-1">
      {alert.show && (
        <Alert
          variant={alert.variant}
          dismissible
          onClose={() => setAlert({ show: false })}
        >
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2
                className="fw-bold mb-2"
                style={{ color: "var(--primary-color)" }}
              >
                Shopping Carts
              </h2>
              <p className="text-muted mb-0">Manage customer shopping carts</p>
            </div>
            <Button variant="primary" onClick={handleAddCart}>
              <FaPlus className="me-2" />
              Add Cart
            </Button>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading carts...</p>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {carts.map((cart) => (
              <Col key={cart.id} xs={12} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm hover-lift">
                  <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <FaShoppingCart
                        className="me-2"
                        color="var(--text-primary)"
                      />
                      <strong style={{ color: "var(--text-primary)" }}>
                        Cart #{cart.id}
                      </strong>
                    </div>
                    <Badge bg="secondary">{cart.totalProducts} items</Badge>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <small className="text-muted">User ID:</small>
                      <p className="mb-1 fw-semibold">{cart.userId}</p>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Total Quantity:</small>
                      <p className="mb-1 fw-semibold">{cart.totalQuantity}</p>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Total Amount:</small>
                      <h5
                        className="fw-bold mb-0"
                        style={{ color: "var(--primary-color)" }}
                      >
                        ${cart.total?.toFixed(2)}
                      </h5>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleViewCart(cart)}
                      >
                        <FaEye className="me-1" /> View
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleEditCart(cart)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleDeleteCart(cart.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>
            {modalMode === "add" ? "Add New Cart" : "Edit Cart"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} (ID: {user.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Label>Products</Form.Label>
            {formData.products.map((product, index) => (
              <Row key={index} className="mb-3 align-items-end">
                <Col md={8}>
                  <Form.Select
                    value={product.id}
                    onChange={(e) =>
                      updateFormProduct(index, "id", e.target.value)
                    }
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} - ${p.price}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={product.quantity}
                    onChange={(e) =>
                      updateFormProduct(index, "quantity", e.target.value)
                    }
                    required
                  />
                </Col>
                <Col md={1}>
                  {formData.products.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeProductFromForm(index)}
                    >
                      <FaTrash />
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
            <Button
              variant="primary"
              size="sm"
              className="mb-3"
              onClick={addProductToForm}
            >
              <FaPlus className="me-2" />
              Add Product
            </Button>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === "add" ? "Add Cart" : "Update Cart"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>Cart Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCart && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Cart ID:</strong> {selectedCart.id}
                  </p>
                  <p className="mb-1">
                    <strong>User ID:</strong> {selectedCart.userId}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Total Products:</strong>{" "}
                    {selectedCart.totalProducts}
                  </p>
                  <p className="mb-1">
                    <strong>Total Quantity:</strong>{" "}
                    {selectedCart.totalQuantity}
                  </p>
                </Col>
              </Row>
              <h5 className="fw-semibold mb-3">Products</h5>
              <div className="d-none d-md-block">
                <Table bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCart.products.map((prod) => (
                      <tr key={prod.id}>
                        <td>{prod.title}</td>
                        <td>${prod.price}</td>
                        <td>{prod.quantity}</td>
                        <td>${prod.total}</td>
                        <td>{prod.discountPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="d-md-none">
                {selectedCart.products.map((prod) => (
                  <Card key={prod.id} className="mb-3 shadow-sm">
                    <Card.Body>
                      <h6 className="fw-bold mb-2">{prod.title}</h6>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Price</span>
                        <span>${prod.price}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Qty</span>
                        <span>{prod.quantity}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Discount</span>
                        <span>{prod.discountPercentage}%</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total</span>
                        <span>${prod.total}</span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
              <div className="text-end">
                <h4
                  className="fw-bold "
                  style={{ color: "var(--primary-color)" }}
                >
                  Total: ${selectedCart.total?.toFixed(2)}
                </h4>
                <p className="text-muted">
                  Discounted Total: ${selectedCart.discountedTotal?.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Carts;
