import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import AccessRecordsTable from './components/AccessRecordsTable';
import OtpRecordsView from './components/OtpRecordsView';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              SmartDoorLock
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Access Records
                </Nav.Link>
                <Nav.Link as={Link} to="/otp">
                  OTP Records
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="py-4">
          <Routes>
            <Route path="/" element={<AccessRecordsTable />} />
            <Route path="/otp" element={<OtpRecordsView />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
