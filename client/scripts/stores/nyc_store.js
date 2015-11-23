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

    this.geoData = null;
  }

  static getGeoDataForBorough(name) {

    const geoData = this.getState().geoData;

    if (geoData && geoData[name]) {
      return geoData[name];
    } else {
      API.getGeoJSON();
    }
  }

  onReceiveGeoData(data) {
    this.geoData = _.transform(this.boroughs, (result, value, key ) => result[key] = data.features[value]);
  }

};

export default alt.createStore(NYCStore, "NYCStore");