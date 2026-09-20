import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bb-footer">
      <div className="container bb-footer__inner">
        <div>
          <p className="bb-footer__logo">
            BorrowBox<span>.</span>
          </p>
          <p className="bb-footer__tag">Borrow what you need, when you need it.</p>
        </div>

        <div className="bb-footer__links">
          <Link to="/browse">Browse items</Link>
          <Link to="/register">Get started</Link>
          <Link to="/login">Log in</Link>
        </div>

        <p className="bb-footer__copy">© {new Date().getFullYear()} BorrowBox. Built with the MERN stack.</p>
      </div>
    </footer>
  );
};

export default Footer;
