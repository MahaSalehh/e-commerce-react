import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

function Layout() {
  var auth = useAuth();
  var user = auth.user;
  var isAuthenticated = auth.isAuthenticated;
  var location = useLocation();

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          <div className="navbar-header-row">
            <Navbar.Brand
              as={Link}
              to={isAuthenticated ? "/Dashboard" : "/"}
              className="fw-bold mb-0"
            >
              <FaShoppingBag className="me-2" />
              E-Commerce Store
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler"/>
          </div>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/Dashboard"
                className={isActive("/Dashboard") ? "active" : ""}
              >
                <FaHome className="me-1" /> Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Products"
                className={isActive("/Products") ? "active" : ""}
              >
                <FaShoppingBag className="me-1" /> Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Carts"
                className={isActive("/Carts") ? "active" : ""}
              >
                <FaShoppingCart className="me-1" /> Carts
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Users"
                className={isActive("/Users") ? "active" : ""}
              >
                <FaUsers className="me-1" /> Users
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Profile"
                className={isActive("/Profile") ? "active" : ""}
              >
                <FaUser className="me-1" />{" "}
                {user && user.firstName ? user.firstName : "Profile"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5">
        <main
          className="flex-grow-1"
          style={{ backgroundColor: "var(--background-light)" }}
        >
          <Outlet />
        </main>
      </Container>

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

export default Layout;
