import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
  Modal,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { productsAPI } from "../../service/api";
import PaginationComponent from "../../components/PaginationComponent";
function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
  });

  const [showDetailModal, setShowDetailModal] = useState(false);  
  const [productsPerPage, setProductsPerPage] = useState(12);
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 576) {
          setProductsPerPage(6);
        } else {
          setProductsPerPage(12);
        }
        setCurrentPage(1);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, productsPerPage]);
  async function fetchCategories() {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * productsPerPage;
      let response;
      if (searchQuery) response = await productsAPI.search(searchQuery);
      else if (selectedCategory)
        response = await productsAPI.getByCategory(selectedCategory);
      else
        response = await productsAPI.getAll({ limit: productsPerPage, skip });
      let fetchedProducts = response.data.products;
      setTotalProducts(response.data.total);
      if (sortBy) {
        fetchedProducts = [...fetchedProducts].sort((a, b) => {
          if (sortBy === "price-asc") return a.price - b.price;
          if (sortBy === "price-desc") return b.price - a.price;
          if (sortBy === "rating") return b.rating - a.rating;
          if (sortBy === "title") return a.title.localeCompare(b.title);
          return 0;
        });
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error(error);
      showAlert("Failed to fetch products", "danger");
    } finally {
      setLoading(false);
    }
  }

  function showAlert(message, variant) {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  }

  function handleSearch() {
    setCurrentPage(1);
    fetchProducts();
  }
  function handleAddProduct() {
    setModalMode("add");
    setFormData({
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      stock: "",
    });
    setShowModal(true);
  }

  function handleEditProduct(product) {
    setModalMode("edit");
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
    });
    setShowModal(true);
  }

  async function handleViewProduct(product) {
    try {
      const response = await productsAPI.getById(product.id);
      setSelectedProduct(response.data);
      setShowDetailModal(true);
    } catch {
      showAlert("Failed to fetch product details", "danger");
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      await productsAPI.delete(id);
      showAlert("Product deleted successfully", "success");
      fetchProducts();
    } catch {
      showAlert("Failed to delete product", "danger");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (modalMode === "add") await productsAPI.add(formData);
      else await productsAPI.update(selectedProduct.id, formData);

      showAlert(
        modalMode === "add" ? "Product added" : "Product updated",
        "success"
      );
      setShowModal(false);
      fetchProducts();
    } catch {
      showAlert(`Failed to ${modalMode} product`, "danger");
    }
  }
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  return (
    <Container fluid className="py-1">
      {alert.show && (
        <Alert variant={alert.variant} dismissible>
          {alert.message}
        </Alert>
      )}
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h2
              className="fw-bold mb-2"
              style={{ color: "var(--primary-color)" }}
            >
              Products Management
            </h2>
            <p className="text-muted mb-0">
              Browse, search, and manage products
            </p>
          </div>
          <Button variant="primary" onClick={handleAddProduct}>
            <FaPlus className="me-2" />
            Add Product
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col lg={4} className="mb-3 mb-lg-0">
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
        <Col lg={4} className="mb-3 mb-lg-0">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.slug || cat}>
                {cat.name || cat}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col lg={4}>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="title">Title (A-Z)</option>
          </Form.Select>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product.id} xs={12} sm={6} lg={4} xl={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Img
                    src={product.thumbnail}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="mt-auto d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="secondary" className="mb-2 ">
                        {product.category}
                      </Badge>
                    </div>
                    <Card.Title className="h6 fw-semibold">
                      {product.title}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {product.description?.substring(0, 60)}...
                    </Card.Text>
                    <div className="mt-auto d-flex justify-content-between align-items-center mb-2">
                      <h5
                        className="fw-bold mb-0"
                        style={{ color: "var(--primary-color)" }}
                      >
                        ${product.price}
                      </h5>
                      <Badge bg="warning" text="dark">
                        ⭐ {product.rating}
                      </Badge>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleViewProduct(product)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleEditProduct(product)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="flex-fill"
                        onClick={() => handleDeleteProduct(product.id)}
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
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Add Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    required
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.slug || cat}>
                        {cat.name || cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {modalMode === "add" ? "Add" : "Update"}
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
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img
                  src={selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                  className="img-fluid rounded"
                />
              </Col>
              <Col md={6}>
                <h4>{selectedProduct.title}</h4>
                <Badge bg="secondary" className="mb-2">
                  {selectedProduct.category}
                </Badge>
                <p>{selectedProduct.description}</p>
                <hr />
                <p>Price: ${selectedProduct.price}</p>
                <p>Brand: {selectedProduct.brand}</p>
                <p>Stock: {selectedProduct.stock}</p>
                <p>Rating: ⭐ {selectedProduct.rating}</p>
                <p>Discount: {selectedProduct.discountPercentage}%</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Products;
