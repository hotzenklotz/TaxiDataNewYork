import React from "react";
import { Link } from "react-router";
import AppBar from "material-ui/lib/app-bar";
import Colors from "material-ui/lib/styles/colors";

import Component from "./base_component.jsx";
import Logo from "../../images/apple-touch-icon-72x72.png";

class Header extends Component {

  render() {

    const logo = <img src="../../dist/images/apple-touch-icon-72x72.png" width="48px" height="48px"/>;

    return (
      <AppBar
        title="New York Taxi Data"
        iconElementLeft={logo}
        style={{backgroundColor: Colors.blue500}}
        />
    )
  }
};

export default Header;
