// src/components/Navigation.js
import { Link } from "react-router-dom";

const Navigation = ({ auth, role, logout }) => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/register">Register</Link>
    <Link to="/login">Login</Link>
    {auth && (
      <>
        <Link to="/protected">Protected</Link>
        {role === "ADMIN" && <Link to="/admin">Admin</Link>}
        <button onClick={logout}>Logout</button>
      </>
    )}
  </nav>
);

export default Navigation;
