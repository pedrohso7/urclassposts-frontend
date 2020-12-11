import React from 'react';
import { Link } from "react-router-dom";
import { Tab, Row, Nav, Col } from 'react-bootstrap';
import Home from '../Home'

const SideMenu = () => {
    return(
        <Tab.Container id="left-tabs" defaultActiveKey="first">
            <Row>
                <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="first">Lista de turmas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="second">Editar Perfil</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <Home/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <EditUserForm/>
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}


export default SideMenu;
