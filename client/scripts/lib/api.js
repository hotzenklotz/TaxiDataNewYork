import FetchUtils from "./fetchUtils";
import NYCStore from "../stores/nyc_store.js";
import APIActions from "../actions/api_actions.js";

const API = {

  getGeoJSON() {
    const url = `/api/geojson/boroughs`;

    return FetchUtils.fetchJson(url)
      .then((data) => APIActions.receiveGeoData(data));
  },

   getGeoJSONneighborhoods() {
    const neighborhoods = `/api/geojson/neighborhoods_zip`;

    return FetchUtils.fetchJson(neighborhoods)
      .then((data) => APIActions.receiveGeoDataNeighborhoods(data));
  }
};

export default API