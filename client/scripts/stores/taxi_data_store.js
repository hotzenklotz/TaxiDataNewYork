import _ from "lodash"
import alt from "../alt";
import SettingsStore from "./settings_store";
import SettingsActions from "../actions/settings_actions";
import APIActions from "../actions/api_actions";
import API from "../lib/api";

class TaxiDataStore {

  constructor() {
    this.bindActions(SettingsActions);
    this.bindActions(APIActions);

    this.priceDataNeighborhoods = null;
    this.countDataNeighborhoods = null;

    const [startTime, endTime] = SettingsStore.getDates();
    //API.getTaxiData(startTime, endTime)
  }

  static getPriceDataForNeighborhood(index) {

    const priceData = this.getState().priceDataNeighborhoods;

    if (priceData && priceData[index]) {
      return priceData[index];
    }
  }

  static getCountDataForNeighborhood(index) {

    const countData = this.getState().countDataNeighborhoods;

    if (countData && countData[index]) {
      return countData[index];
    }
  }

  onUpdateDates([startTime, endTime]) {
    console.log("Requesting new data")
    //API.getTaxiData(startTime, endTime);
  }

  onReceiveTaxiData(data) {
//    this.priceData =  _.transform(this.boroughs, (result, value, key ) => result[key] = data.features[value]);
//    this.countData =  _.transform(this.boroughs, (result, value, key ) => result[key] = data.features[value]);
  }

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
