import React, {useState, useEffect} from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';


export default function Profile() {
    const { currentUser } = useAuth();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center p-4">
                        <Card.Img variant="top" src={currentUser.photoURL} roundedCircle style={{ width: '150px', height: '150px', margin: '0 auto' }} />
                        <Card.Body>
                            <>
                                <Card.Title>{currentUser.displayName}</Card.Title>
                                <Card.Text>{currentUser.email}</Card.Text>
                            </>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}