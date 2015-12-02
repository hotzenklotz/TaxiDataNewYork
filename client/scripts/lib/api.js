import FetchUtils from "./fetchUtils";
import APIActions from "../actions/api_actions.js";

const API = {

  getGeoJSONneighborhoods(timeStar, timeEnd) {

    const neighborhoods = "/api/neighborhoods";

    return FetchUtils.fetchJson(neighborhoods)
      .then((data) => APIActions.receiveGeoDataNeighborhoods(data));
  }


};

export default API