import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  var [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  var [error, setError] = useState("");
  var [loading, setLoading] = useState(false);
  var auth = useAuth();
  var login = auth.login;
  var navigate = useNavigate();
  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    var newFormData = {
      username: formData.username,
      password: formData.password,
    };
    newFormData[name] = value;
    setFormData(newFormData);
  }
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    login(formData).then(function (result) {
      setLoading(false);
      if (result.success) {
        navigate("/Dashboard");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    });
  }
  return (
    <div className="warm-gradient min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold  mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Try: emilys (password: emilyspass)
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>
                <div className="text-center mt-4">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/register" className="fw-semibold link-auth">
                    Sign Up
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
