import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Modal,
  InputGroup,
  Form,
  Alert,
} from "react-bootstrap";
import { FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { usersAPI } from "../../service/api";
import PaginationComponent from "../../components/PaginationComponent";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
    const [usersPerPage, setUsersPerPage] = useState(12);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setUsersPerPage(6);
      } else {
        setUsersPerPage(12);
      }
      setCurrentPage(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * usersPerPage;
      let response;

      if (searchQuery) {
        response = await usersAPI.search(searchQuery);
      } else {
        response = await usersAPI.getAll({ limit: usersPerPage, skip });
      }

      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showAlert("Failed to fetch users", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 3000);
  };

  const handleViewUser = async (user) => {
    try {
      const response = await usersAPI.getById(user.id);
      setSelectedUser(response.data);
      setShowDetailModal(true);
    } catch (error) {
      showAlert("Failed to fetch user details", "danger");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await usersAPI.delete(id);
        showAlert("User deleted successfully", "success");
        fetchUsers();
      } catch (error) {
        showAlert("Failed to delete user", "danger");
      }
    }
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);
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
          <h2
            className="fw-bold mb-2"
            style={{ color: "var(--primary-color)" }}
          >
            User Management
          </h2>
          <p className="text-muted mb-0">View and manage user accounts</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch}>
              <FaSearch />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading users...</p>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {users.map((user) => (
              <Col key={user.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 border-0 shadow-sm hover-lift text-center">
                  <Card.Img
                    variant="top"
                    src={user.image}
                    className="rounded-circle mx-auto mt-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6 fw-semibold">
                      {user.firstName} {user.lastName}
                    </Card.Title>
                    <div className="mt-auto justify-content-between align-items-center mb-2">
                      <Badge
                        bg={user.gender === "male" ? "secondary" : "danger"}
                        className="mb-2"
                        style={{
                          padding: "0.25rem 0.4rem",
                          fontSize: "0.75rem",
                          lineHeight: "1",
                        }}
                      >
                        {user.gender}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-3">{user.email}</p>
                    <div className="d-flex gap-2 mt-auto justify-content-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
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
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={4} className="text-center mb-4 mb-md-0">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.firstName}
                  className="img-fluid rounded-circle mb-3"
                  style={{ maxWidth: "200px" }}
                />
                <h4 className="fw-bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h4>
                <Badge bg="secondary" className="mb-2">
                  @{selectedUser.username}
                </Badge>
              </Col>
              <Col md={8}>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>Age:</strong> {selectedUser.age}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedUser.gender}
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Users;
