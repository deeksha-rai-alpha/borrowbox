import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { getInitials } from "../../utils/helpers";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const links = [
    { to: "/browse", label: "Browse" },
    { to: "/my-items", label: "My Items" },
    { to: "/my-borrowings", label: "My Borrowings" },
    { to: "/requests", label: "Requests" },
  ];

  return (
    <header className="bb-nav">
      <div className="container bb-nav__inner">
        <Link to="/" className="bb-nav__logo">
          BorrowBox<span>.</span>
        </Link>

        {user && (
          <nav className="bb-nav__links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `bb-nav__link ${isActive ? "is-active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
            {user.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `bb-nav__link ${isActive ? "is-active" : ""}`}
              >
                Admin
              </NavLink>
            )}
          </nav>
        )}

        <div className="bb-nav__actions">
          {user ? (
            <>
              <Link to="/notifications" className="bb-nav__icon-btn" aria-label="Notifications">
                🔔
              </Link>
              <Link to="/dashboard" className="bb-nav__avatar">
                {user.profileImage?.url ? (
                  <img src={user.profileImage.url} alt={user.name} />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}

          <button
            className="bb-nav__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && user && (
        <div className="bb-nav__mobile">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {user.role === "admin" && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
