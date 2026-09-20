import { NavLink } from "react-router-dom";
import "./AdminNav.css";

const AdminNav = () => {
  const links = [
    { to: "/admin", label: "Overview", end: true },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/items", label: "Items" },
  ];

  return (
    <div className="bb-adminnav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `bb-adminnav__link ${isActive ? "is-active" : ""}`}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
};

export default AdminNav;
