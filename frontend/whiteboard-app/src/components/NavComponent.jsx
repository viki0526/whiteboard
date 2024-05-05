import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebaseConfig';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../css/NavComponent.css';

export default function NavComponent() {
    const { currentUser } = useAuth();
    // console.log(currentUser);

    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            console.log("Logged out successfully!");
            navigate('/');
        }).catch((error) => {
            console.error("Logout failed", error);
        });
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
            <Navbar.Brand>Collaborative Whiteboard with Sketch Autocomplete</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {!currentUser && <Nav.Link href="/login">Login</Nav.Link>}
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/whiteboard">Whiteboard</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
            {currentUser && 
                <Dropdown>
                <Dropdown.Toggle id="dropdown-custom-components">
                    <img
                        src={currentUser.photoURL}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Profile picture"
                        style={{ borderRadius: '50%' }}
                    />
                </Dropdown.Toggle>
    
                <Dropdown.Menu id="dropdown-custom-menu">
                    <Dropdown.Item href="/profile">View Profile</Dropdown.Item>
                    <Dropdown.Item href="/" onClick={handleLogout} >Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            }
        </Navbar>
    );
}
