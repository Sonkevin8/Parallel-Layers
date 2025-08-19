import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Event Announcements</Link></li>
        <li><Link to="/experiences">User Experiences</Link></li>
        <li><Link to="/merchandise">Merchandise</Link></li>
        <li><Link to="/artwork">Artwork</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;