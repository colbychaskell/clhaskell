import logo from '../img/logo.png'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const SiteNav = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="sm" className='w-100'>
      <LinkContainer to="/">
        <Navbar.Brand className="me-auto">
          <img
            style={{ height: "40px" }}
            id='logo'
            src={logo}
            alt="C.L. Haskell & Son Inc." className="ms-3" />
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className='me-3'/>
      <Navbar.Collapse id="basic-navbar-nav"> 
        <Nav className="ms-auto me-3">
          <LinkContainer to="/" className='ms-3'><Nav.Link>Home</Nav.Link></LinkContainer>
          <LinkContainer to="/services" className='ms-3'><Nav.Link>Services</Nav.Link></LinkContainer>
          <LinkContainer to="/contact" className='ms-3'><Nav.Link>Contact</Nav.Link></LinkContainer>
        {/* TODO: */}
        {/* <LinkContainer to="/billing"><Nav.Link>Billing</Nav.Link></LinkContainer> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default SiteNav