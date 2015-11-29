import _ from "lodash"
import alt from "../alt";
import SettingsActions from "../actions/settings_actions";

import NYCStore from "./nyc_store";

class SettingsStore {

  constructor() {
    this.bindActions(SettingsActions);

    this.location = [40.7127, -74.0059];
    this.activeBoroughs = _.values(NYCStore.getState().boroughs).map(() => false);  
    this.activeNeighborhoods = _.fill(Array(NYCStore.getState().neighborhoodsCount), false); 
    this.highlightFeature = "fares"; // or "rideCount"
  }

  onUpdateLocation(location) {
    this.location = location;
  }

  onUpdateHighlightFeature(value) {
    this.highlightFeature = value;
  }

  onToggleBorough([index, evt]) {
    this.activeBoroughs[index] = !this.activeBoroughs[index];
  }

  onMouseOverNeigborHood([index, evt]){ 
    this.activeNeighborhoods[index] = true;
  }

  onMouseOutNeigborHood([index, evt]){
    this.activeNeighborhoods[index] = false;
  }

};

export default alt.createStore(SettingsStore, "SettingsStore");