import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Container } from "react-bootstrap";

// only allow access if user is logged in
function ProtectedRoute(props) {
  var children = props.children;

  // get auth information from context
  var auth = useAuth();
  var isAuthenticated = auth.isAuthenticated;
  var loading = auth.loading;
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if logged in show page content
  return children;
}

export default ProtectedRoute;
