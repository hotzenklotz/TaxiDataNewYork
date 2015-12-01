import FetchUtils from "./fetchUtils";
import APIActions from "../actions/api_actions.js";

const API = {

  getGeoJSON() {
    const url = `/api/geojson/boroughs`;

    return FetchUtils.fetchJson(url)
      .then((data) => APIActions.receiveGeoData(data));
  },

   getGeoJSONneighborhoods() {
    const time_start = 1285884000;
    const time_end = 1299884000;

    const neighborhoods = `/api/neighborhoods?time_start=${time_start}&time_end=${time_end}`;

    return FetchUtils.fetchJson(neighborhoods)
      .then((data) => APIActions.receiveGeoDataNeighborhoods(data));
  }
};

export default API