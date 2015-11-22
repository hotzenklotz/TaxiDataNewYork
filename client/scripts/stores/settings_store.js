import _ from "lodash"
import alt from "../alt";
import SettingsActions from "../actions/settings_actions";

class SettingsStore {

  constructor() {
    this.bindActions(SettingsActions);

    this.location = [52.3937903, 13.1296473];
  }

  onUpdateLocation(location) {
    this.location = location;
  }


};

export default alt.createStore(SettingsStore, "SettingsStore");