import _ from "lodash"
import alt from "../alt";
import API from "../lib/api";
import APIActions from "../actions/api_actions";

class NYCStore {

  constructor() {

    this.bindActions(APIActions);

    this.boroughs = {
      "Staten Island": 0,
      "Queens": 1,
      "Brooklyn": 2,
      "Manhattan": 3,
      "Bronx": 4
    };

    this.neighborhoodNames = [];
    this.geoData = null;
    this.geoDataNeighborhoods = [];
    this.neighborhoodsCount = 262;

    API.getGeoJSONneighborhoods();
  }

  static getGeoDataForBorough(name) {

    const geoData = this.getState().geoData;

    if (geoData && geoData[name]) {
      return geoData[name];
    } else {
      API.getGeoJSON();
    }
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
    data.features.forEach((feature, i) => {
      this.neighborhoodNames[i] = feature.properties.postalCode + " " + feature.properties.PO_NAME;
      this.geoDataNeighborhoods[i] = feature;
    });
  }
};

export default alt.createStore(NYCStore, "NYCStore");