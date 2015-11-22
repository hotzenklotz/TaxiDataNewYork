import React from "react";
import _ from "lodash";
import Component from "../components/base_component.jsx";
import SettingsCard from "../components/settings_card.jsx";
import Spinner from "../components/spinner.jsx";
import TaxiMap from "../components/map.jsx";

class Home extends Component {

  render() {

    return (
      <div className="home-page">
        <SettingsCard/>
        <TaxiMap/>
      </div>
    );
  }
}

export default Home;
