import FetchUtils from "./fetchUtils";
import APIActions from "../actions/api_actions.js";

const API = {

  getGeoJSONneighborhoods(timeStar, timeEnd) {

    const neighborhoods = "/api/neighborhoods";

    return FetchUtils.fetchJson(neighborhoods)
      .then((data) => APIActions.receiveGeoDataNeighborhoods(data));
  },

  getRideCountDataneighborhoods(timeStar, timeEnd) {

    const neighborhoods = "/api/neighborhoods/rides";

    return FetchUtils.fetchJson(neighborhoods + "?time_start=" + timeStar + "&time_end=" + timeEnd)
      .then((data) => APIActions.receiveRideCountData(data));
  },

  getFareDataneighborhoods(timeStar, timeEnd) {

    const neighborhoods = "/api/neighborhoods/details";

    return FetchUtils.fetchJson(neighborhoods + "?time_start=" + timeStar + "&time_end=" + timeEnd)
      .then((data) => APIActions.receiveFareData(data));
  }

};

export default API
