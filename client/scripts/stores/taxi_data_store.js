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
    this.ridesDataNeighborhoods = null;

    const [startTime, endTime] = SettingsStore.getDates();
    API.getTaxiDataneighborhoods(startTime, endTime)
  }

  static getPriceDataForNeighborhood(index) {

    const priceData = this.getState().priceDataNeighborhoods;

    if (priceData && priceData[index]) {
      return priceData[index];
    }
  }

  static getIncomingRidesForNeighborhood(index) {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData[index]) {
      return countData[index]["incoming_rides"];
    }
  }

  static getOutgoingRidesForNeighborhood(index) {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData[index]) {
      return countData[index]["outgoing_rides"];
    }
  }

  onUpdateDates([startTime, endTime]) {
    console.log("Requesting new data")
    API.getTaxiDataneighborhoods(startTime, endTime);
  }

  onReceiveTaxiData(data) {
    console.log("Receiving new data")
    this.ridesDataNeighborhoods =  data;
    console.log(this.ridesDataNeighborhoods);
  }

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
