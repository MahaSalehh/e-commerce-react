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
  InputGroup,
  Alert,
} from "react-bootstrap";
import { FaSearch, FaEye } from "react-icons/fa";
import { productsAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../components/PaginationComponent";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [productsPerPage, setProductsPerPage] = useState(12);

  const navigate = useNavigate();
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

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * productsPerPage;
      let response;

      if (searchQuery) {
        response = await productsAPI.search(searchQuery);
      } else if (selectedCategory) {
        response = await productsAPI.getByCategory(selectedCategory);
      } else {
        response = await productsAPI.getAll({
          limit: productsPerPage,
          skip,
        });
      }

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
      showAlert("Failed to fetch products", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <Container fluid className="py-4">
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}

      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold" style={{ color: "var(--primary-color)" }}>
            Products
          </h2>
          <p className="text-muted">Browse and view products</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={4} className="mb-2">
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>

        <Col lg={4} className="mb-2">
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

        <Col lg={4} className="mb-2">
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
        </div>
      ) : (
        <>
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product.id} lg={3} md={4} sm={6}>
                <Card className="h-100 shadow-sm position-relative">
                  <Card.Img src={product.thumbnail} height={200} />

                  <Card.Body>
                    <Badge bg="secondary">{product.category}</Badge>

                    <h6 className="mt-2">{product.title}</h6>

                    <p className="text-muted small">
                      {product.description?.slice(0, 60)}...
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <strong>${product.price}</strong>
                      <Button
                        variant="primary"
                        size="sm"
                      >
                        <FaEye />
                      </Button>
                    </div>
                    <span
                      style={{ cursor: "pointer" }}
                      className="stretched-link"
                      onClick={() => handleViewProduct(product)}
                    />
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
    </Container>
  );
};

export default Products;
