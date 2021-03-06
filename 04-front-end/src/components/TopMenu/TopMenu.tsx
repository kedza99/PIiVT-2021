import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

 class TopMenuProperties {
     currentMenuType: "administrator" | "visitor" = "visitor";
 }

export default class TopMenu extends React.Component<TopMenuProperties>{
    render() {
         if (this.props.currentMenuType === "visitor") {
            return (
                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/aboutUs">About Us</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/">Special Offers</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/animator">Animators</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/logIn">Admin LogIn</Link>
                    </Nav.Item>
                </Nav>
            );
        }

        if (this.props.currentMenuType === "administrator") {
            return (
                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/aboutUs">About Us</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/">Special Offers</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/animator">Animators</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/reservation">Reservations</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/logOut">Admin LogOut</Link>
                    </Nav.Item>
                </Nav>
            );
        }
    }
}