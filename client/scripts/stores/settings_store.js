import _ from "lodash"
import alt from "../alt";
import SettingsActions from "../actions/settings_actions";

import NYCStore from "./nyc_store";

class SettingsStore {

  constructor() {
    this.bindActions(SettingsActions);

    this.zoom = 13;
    this.location = [40.74003879540742, -73.9247703552246];
    this.activeBoroughs = _.map(NYCStore.getState().boroughsMap, () => true);
    this.highlightFeature = "rideCount"; // "fares" or "rideCount"

    // Used to limit the date slider
    this.minTime = 1262304000; // 01.01.2010
    this.maxTime = 1388448000; // 31.12.2013

    // Unix Timestamps for the start/end of the data requests
    this.timeStart = 1293926400; // 01.01.2011
    this.timeEnd = 1325289600; // 31.12.2011
  }

  onUpdateMapParams([location, zoom]) {
    this.location = location;
    this.zoom = zoom;
  }

  onUpdateLocation(location) {
    this.location = location;
  }

  onUpdateHighlightFeature(value) {
    this.highlightFeature = value;
  }

  onUpdateDates([startValue, endValue]) {
    this.timeStart = startValue;
    this.timeEnd = endValue;
  }

  onToggleBorough([index, evt]) {
    this.activeBoroughs[index] = !this.activeBoroughs[index];
  }

  static getDates() {
    const state = this.getState()
    return [state.timeStart, state.timeEnd]
  }

};

export default alt.createStore(SettingsStore, "SettingsStore");
