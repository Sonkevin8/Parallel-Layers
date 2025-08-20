import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>Event Announcements</NavLink></li>
        <li><NavLink to="/experiences" className={({ isActive }) => isActive ? "active" : ""}>User Experiences</NavLink></li>
        <li><NavLink to="/merchandise" className={({ isActive }) => isActive ? "active" : ""}>Merchandise</NavLink></li>
        <li><NavLink to="/artwork" className={({ isActive }) => isActive ? "active" : ""}>Artwork</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;