import React from "react";
import _ from "lodash";
import Component from "../components/baseComponent.jsx";
import TaxiMap from "../components/map.jsx";

class Home extends Component {

  render() {

    return (
      <div className="home-page">
        <TaxiMap/>
      </div>
    );
  }
}

export default Home;
