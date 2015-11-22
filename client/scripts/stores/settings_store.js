import _ from "lodash"
import alt from "../alt";
import SettingsActions from "../actions/settings_actions";

class SettingsStore {

  constructor() {
    this.bindActions(SettingsActions);

    this.location = [40.7127, -74.0059];
  }

  onUpdateLocation(location) {
    this.location = location;
  }


};

export default alt.createStore(SettingsStore, "SettingsStore");