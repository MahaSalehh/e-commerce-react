import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import Products from "../public/Products";

function Home() {
  return (
    <div className="app-layout">
      <Navbar expand="lg" sticky="top">
        <Container>
          <Navbar.Brand>
            <FaShoppingBag className="me-2" />
            E-Commerce Store
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end gap-2">
            <Button as={Link} to="/Login" variant="light" size="sm">
              Login
            </Button>
            <Button as={Link} to="/Register" variant="primary" size="sm">
              Register
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="fw-bold mb-3">Welcome to E-Shop</h1>
          <p className="lead mb-4">
            Discover products with a modern shopping experience
          </p>
          <Button href="#products-section" size="lg" variant="primary">
            Start Shopping
          </Button>
        </div>
      </section>

      <section className="section">
        <Container>
          <Row
            className="text-center g-4"
            style={{ color: "var(--text-primary)" }}
          >
            <Col md={4}>
              <div className="p-4 card h-100">
                <h4 className="fw-bold">⚡ Fast</h4>
                <p className="text-muted">
                  Smooth browsing and fast product loading.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 card h-100">
                <h4 className="fw-bold">🔐 Secure</h4>
                <p className="text-muted">
                  Secure authentication and protected routes.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 card h-100">
                <h4 className="fw-bold">🚀 Modern</h4>
                <p className="text-muted">
                  Built with React, Vite & Bootstrap.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section" id="products-section">
        <Container>
          <h2
            className="text-center mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Featured Products
          </h2>
          <Row>
            <Products limit={4} />
          </Row>
        </Container>
      </section>

      <footer className="bg-white border-top py-3 mt-auto">
        <Container>
          <div className="text-center text-muted">
            <p className="mb-0">
              © 2025 E-Commerce Store. Built with React & React Bootstrap.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
