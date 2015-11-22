import FetchUtils from "./fetchUtils";
import NYCStore from "../stores/nyc_store.js";
import APIActions from "../actions/api_actions.js";

const API = {

  getGeoJSON() {
    const url = `/api/geojson/nyc`;

    return FetchUtils.fetchJson(url)
      .then((data) => APIActions.receiveGeoData(data));
  }
};

export default API