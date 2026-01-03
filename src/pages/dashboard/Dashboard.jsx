import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import { productsAPI, cartsAPI, usersAPI } from "../../service/api";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    carts: 0,
    users: 0,
    categories: 0,
  });

  const [loading, setLoading] = useState(true);
  useEffect(function () {
    async function fetchStats() {
      try {
        const [productsRes, cartsRes, usersRes, categoriesRes] =
          await Promise.all([
            productsAPI.getAll({ limit: 0 }),
            cartsAPI.getAll({ limit: 0 }),
            usersAPI.getAll({ limit: 0 }),
            productsAPI.getCategories(),
          ]);

        setStats({
          products: productsRes.data.total,
          carts: cartsRes.data.total,
          users: usersRes.data.total,
          categories: categoriesRes.data.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);
  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: <FaShoppingBag size={40} />,
      bgGradient: "linear-gradient(35deg, #2c231fff 0%, #35AFEA 100%)",
    },
    {
      title: "Active Carts",
      value: stats.carts,
      icon: <FaShoppingCart size={40} />,
      bgGradient: "linear-gradient(135deg, #7780C9 0%, #ab5a7d 100%)",
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: <FaUsers size={40} />,
      bgGradient: "linear-gradient(135deg, #0E2457 0%, #C4C4DE 100%)",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: <FaBoxOpen size={40} />,
      bgGradient: "linear-gradient(135deg, #643e60 0%, #536184 100%)",
    },
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-1">
      <Row className="mb-4">
        <Col>
          <h2
            className="fw-bold mb-3"
            style={{ color: "var(--primary-color)" }}
          >
            Dashboard Overview
          </h2>
          <p className="text-muted">
            Welcome to your e-commerce management dashboard
          </p>
        </Col>
      </Row>
      <Row className="g-4 mb-4">
        {statCards.map(function (card, index) {
          return (
            <Col key={index} xs={12} sm={6} lg={3}>
              <Card
                className="border-0 h-100"
                style={{ background: card.bgGradient }}
              >
                <Card.Body className="text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 opacity-75">{card.title}</p>
                      <h2 className="fw-bold mb-0">{card.value}</h2>
                    </div>
                    <div className="opacity-75">{card.icon}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Row className="g-4 py-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5
                className="mb-0 fw-semibold "
                style={{ color: "var(--text-primary)" }}
              >
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3" style={{ color: "var(--text-primary)" }}>
                <Col md={6} lg={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Link
                        to="/Products"
                        className="fw-semibold link-decoration"
                      >
                        <FaShoppingBag
                          size={32}
                          className="mb-3"
                          color="#3c59a1d9"
                        />
                        <h6 className="fw-semibold">Manage Products</h6>
                        <p className="text-muted small mb-0">
                          View, add, edit products
                        </p>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Link to="/Carts" className="fw-semibold link-decoration">
                        <FaShoppingCart
                          size={32}
                          className="mb-3"
                          color="#693a8bff"
                        />
                        <h6 className="fw-semibold">View Carts</h6>
                        <p className="text-muted small mb-0">
                          Monitor customer carts
                        </p>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Link to="/Users" className="fw-semibold link-decoration">
                        <FaUsers size={32} className="mb-3" color="#1281a9ff" />
                        <h6 className="fw-semibold">User Management</h6>
                        <p className="text-muted small mb-0">
                          Manage user accounts
                        </p>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="text-center h-100">
                    <Card.Body>
                      <Link
                        to="/Products"
                        className="fw-semibold link-decoration"
                      >
                        <FaBoxOpen
                          size={32}
                          className="mb-3"
                          color="#cec34aff"
                        />
                        <h6 className="fw-semibold">Categories</h6>
                        <p className="text-muted small mb-0">
                          Browse by category
                        </p>{" "}
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
