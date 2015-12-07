import FetchUtils from "./fetchUtils";
import APIActions from "../actions/api_actions.js";
import SettingsActions from "../actions/settings_actions.js";

const API = {

  getGeoJSONneighborhoods(timeStart, timeEnd) {

    const neighborhoods = "/api/neighborhoods";
    SettingsActions.increaseLoadingLocks();
    return FetchUtils.fetchJson(neighborhoods)
      .then((data) => APIActions.receiveGeoDataNeighborhoods(data))
      .then(()=>SettingsActions.decreaseLoadingLocks());
  },

  getRideCountDataNeighborhoods(timeStart, timeEnd) {

    const neighborhoods = "/api/neighborhoods/rides";
    SettingsActions.increaseLoadingLocks();
    return FetchUtils.fetchJson(neighborhoods + "?time_start=" + timeStart + "&time_end=" + timeEnd)
      .then((data) => APIActions.receiveRideCountData(data))
      .then(()=>SettingsActions.decreaseLoadingLocks());
  },

  getFareDataNeighborhoods(timeStart, timeEnd) {

    const neighborhoods = "/api/neighborhoods/details";
    SettingsActions.increaseLoadingLocks();
    return FetchUtils.fetchJson(neighborhoods + "?time_start=" + timeStart + "&time_end=" + timeEnd)
      .then((data) => APIActions.receiveFareData(data))
      .then(()=>SettingsActions.decreaseLoadingLocks());
  }

};

export default API
