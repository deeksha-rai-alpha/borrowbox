import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <section className="section container text-center">
      <h1>404</h1>
      <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>
        This page doesn't exist. Let's get you back to borrowing.
      </p>
      <Link to="/">
        <Button variant="primary">Back to home</Button>
      </Link>
    </section>
  );
};

export default NotFound;
