import FetchUtils from "./fetchUtils";
import APIActions from "../actions/api_actions.js";

const API = {

  getGeoJSONneighborhoods(timeStart, timeEnd) {

    const neighborhoods = "/api/neighborhoods";

    return FetchUtils.fetchJson(neighborhoods)
      .then((data) => APIActions.receiveGeoDataNeighborhoods(data));
  },

  getRideCountDataNeighborhoods(timeStart, timeEnd) {

    const neighborhoods = "/api/neighborhoods/rides";

    return FetchUtils.fetchJson(neighborhoods + "?time_start=" + timeStart + "&time_end=" + timeEnd)
      .then((data) => APIActions.receiveRideCountData(data));
  },

  getFareDataNeighborhoods(timeStart, timeEnd) {

    const neighborhoods = "/api/neighborhoods/details";

    return FetchUtils.fetchJson(neighborhoods + "?time_start=" + timeStart + "&time_end=" + timeEnd)
      .then((data) => APIActions.receiveFareData(data));
  }

};

export default API
