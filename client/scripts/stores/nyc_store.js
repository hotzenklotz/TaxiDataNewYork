import _ from "lodash"
import alt from "../alt";
import API from "../lib/api";
import APIActions from "../actions/api_actions";

class NYCStore {

  constructor() {

    this.bindActions(APIActions);

    this.boroughsMap = {
      0 : "staten_island",
      1 : "queens",
      2 : "brooklyn",
      3 : "manhattan",
      4 : "bronx"
    };

    this.geoData = null;
    this.geoDataNeighborhoods = null;
    this.neighborhoodsCount = 303;

    API.getGeoJSONneighborhoods();
  }

  static getGeoDataForNeighborhood(index) {

    const geoData = this.getState().geoDataNeighborhoods;

    if (geoData && geoData[index]) {
      return geoData[index];
    }
  }

  onReceiveGeoData(data) {
    this.geoData =  _.transform(this.boroughs, (result, value, key ) => result[key] = data.features[value]);
  }

  onReceiveGeoDataNeighborhoods(data) {
    this.geoDataNeighborhoods = data
  }
};

export default alt.createStore(NYCStore, "NYCStore");