import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import "../styles/Navbar.css"

function Header() {

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom">
      <Navbar.Collapse>
        <Nav className="d-flex mx-auto link-section">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          <Nav.Link as={Link} to="/betsense">BetSense</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

