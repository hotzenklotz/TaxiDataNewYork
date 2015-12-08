import _ from "lodash";
import React from "react";
import connectToStores from "alt/utils/connectToStores";
import TaxiDataStore from "../stores/taxi_data_store.js";
import Component from "../components/base_component.jsx";
import SettingsCard from "../components/settings_card.jsx";
import TaxiMap from "../components/map.jsx";
import CircularProgress from "material-ui/lib/circular-progress";
import RefreshIndicator from "material-ui/lib/refresh-indicator";

class Home extends Component {

  static getStores() {
    return [TaxiDataStore];
  }

  static getPropsFromStores() {
    return TaxiDataStore.getState();
  }

  getLoadingSpinner() {
    if(this.props.isLoading)
      return <RefreshIndicator size={100} left={0} top={0} loadingColor={"#FF0000"} status="loading" />;
    else
      return null;
  }

  render() {

    const spinner = this.getLoadingSpinner();

    return (
      <div className="home-page">
        <div className="loading-spinner">
          {spinner}
        </div>
        <SettingsCard/>
        <TaxiMap/>
      </div>
    );
  }
}

export default connectToStores(Home);
