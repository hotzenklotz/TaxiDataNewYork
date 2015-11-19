import React from "react";
import { Link } from "react-router";
import Component from "./baseComponent.jsx";
import Logo from "../../images/apple-touch-icon-72x72.png";


class Header extends Component {

  render() {

    return (
      <nav className="blue">
        <div className="nav-wrapper">
          <div className="col s12">
            <a href="/" className="brand-logo">
              <img src="../../dist/images/apple-touch-icon-72x72.png" width="48px" height="48px"/>
              New York Taxi Data
            </a>
            <ul className="right hide-on-med-and-down">
              <li><Link to="home"><i className="material-icons left">launch</i>Do Stuff</Link></li>
              <li><Link to="home"><i className="material-icons left">polymer</i>Get Stuff</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

};

export default Header;
