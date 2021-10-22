import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// class TopMenuProperties {
//     currentMenuType: "administrator" | "visitor" = "visitor";
// }

export default class TopMenu extends React.Component{
    render() {
        // if (this.props.currentMenuType === "visitor") {
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
                        <Link className="nav-link" to="/logIn">Admin LogIn</Link>
                    </Nav.Item>
                </Nav>
            );
        //}

        // if (this.props.currentMenuType === "administrator") {
        //     return (
        //         <Nav className="justify-content-center">
        //             <Nav.Item>
        //                 <Link className="nav-link" to="/">About Us</Link>
        //             </Nav.Item>

        //             <Nav.Item>
        //                 <Link className="nav-link" to="/">Special Offers</Link>
        //             </Nav.Item>

        //             <Nav.Item>
        //                 <Link className="nav-link" to="/">Animators</Link>
        //             </Nav.Item>

        //             <Nav.Item>
        //                 <Link className="nav-link" to="/">Reservations</Link>
        //             </Nav.Item>

        //             <Nav.Item>
        //                 <Link className="nav-link" to="/">LogOut</Link>
        //             </Nav.Item>
        //         </Nav>
        //     );
        // }
    }
}