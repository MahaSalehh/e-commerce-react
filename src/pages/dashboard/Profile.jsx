import { Container, Card, Button, Row, Col, Image } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container className="py-1 my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=8ba6e9&color=fff&size=128`}
                    roundedCircle
                    alt="User Avatar"
                  />
                </Col>
                <Col md={8}>
                  <h3 className="mb-2">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-muted mb-1">
                    <strong>Email:</strong> {user?.email || user?.username}
                  </p>
                  <p className="text-muted mb-3">
                    <strong>Role:</strong> {user?.role || "User"}
                  </p>
                  <Button variant="danger" onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
