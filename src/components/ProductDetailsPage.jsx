import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI } from "../service/api";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      showAlert("Failed to fetch product details", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  return (
    <Container className="px-1">
      <Button variant="primary" onClick={() => navigate(-1)}>
        ← Back
      </Button>
      {alert.show && (
        <Alert variant={alert.variant} className="mt-3">
          {alert.message}
        </Alert>
      )}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : product ? (
        <Row className="mt-4">
          <Col md={6}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="img-fluid "
            />
          </Col>
          <Col md={6} style={{lineHeight: '2.2rem'}}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {product.rating}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
          </Col>
        </Row>
      ) : (
        <p className="text-center mt-4">Product not found.</p>
      )}
    </Container>
  );
};

export default ProductDetailsPage;
