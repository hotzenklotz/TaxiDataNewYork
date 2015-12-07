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

    this.fareDataNeighborhoods = null;
    this.ridesDataNeighborhoods = null;

    const [startTime, endTime] = SettingsStore.getDates();
    API.getRideCountDataNeighborhoods(startTime, endTime)
    API.getFareDataNeighborhoods(startTime, endTime)
  }

  static getPriceDataForNeighborhood(index) {

    const priceData = this.getState().priceDataNeighborhoods;

    if (priceData && priceData[index]) {
      return priceData[index];
    }
  }

  static getIncomingRidesForNeighborhood(index) {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData["rides"][index]) {
      return countData["rides"][index]["incoming_rides"];
    }
  }

  static getMaxIncomingRidesForNeighborhood() {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData["meta"]) {
      return countData["meta"]["max_incoming"];
    }
  }

  static getMaxOutgoingRidesForNeighborhood() {

    const countData = this.getState().ridesDataNeighborhoods;


    if (countData && countData["meta"]) {
      return countData["meta"]["max_outgoing"];
    }
  }

  static getMinIncomingRidesForNeighborhood() {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData["meta"]) {
      return countData["meta"]["min_incoming"];
    }
  }

  static getMinOutgoingRidesForNeighborhood() {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData["meta"]) {
      return countData["meta"]["min_outgoing"];
    }
  }

  static getAverageFarePerMileForNeighborhood(index) {

    const countData = this.getState().fareDataNeighborhoods;

    if (countData && countData[index]) {
      return countData[index]["avg_fare_per_mile"];
    }
  }

  static getOutgoingRidesForNeighborhood(index) {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData["rides"][index]) {
      return countData["rides"][index]["outgoing_rides"];
    }
  }

  onUpdateDates([startTime, endTime]) {
    if(SettingsStore.getState().highlightFeature == "rideCount") {
      API.getRideCountDataNeighborhoods(startTime, endTime);
    } else {
     API.getFareDataNeighborhoods(startTime, endTime);
    }
  }

  onReceiveRideCountData(data) {
    this.ridesDataNeighborhoods = data;
  }

  onReceiveFareData(data) {
    this.fareDataNeighborhoods = data;
  }

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
