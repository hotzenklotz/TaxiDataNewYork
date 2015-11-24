import _ from "lodash"
import alt from "../alt";
import SettingsActions from "../actions/settings_actions";

import NYCStore from "./nyc_store";

class SettingsStore {

  constructor() {
    this.bindActions(SettingsActions);

    this.location = [40.7127, -74.0059];
    this.activeBoroughs = _.values(NYCStore.getState().boroughs).map(() => true);
    this.highlightFeature = 0; // 0 = avg prices; 1 = num of rides
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


};

export default alt.createStore(SettingsStore, "SettingsStore");