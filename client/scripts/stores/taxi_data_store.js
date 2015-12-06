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
    API.getRideCountDataneighborhoods(startTime, endTime)
    API.getFareDataneighborhoods(startTime, endTime)
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

  static getAverageFarePerMileForNeighborhood(index) {

    const countData = this.getState().fareDataNeighborhoods;

    if (countData && countData[index]) {
      return countData[index]["avg_fare_per_mile"];
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
    if(SettingsStore.highlightFeature == "rideCount")
      API.getRideCountDataneighborhoods(startTime, endTime);
    else
      API.getFareDataneighborhoods(startTime, endTime);
  }

  onReceiveRideCountData(data) {
    console.log("Receiving new ridecount data")
    this.ridesDataNeighborhoods = data;
    console.log(this.ridesDataNeighborhoods);
  }

  onReceiveFareData(data) {
    console.log("Receiving new fare data")
    this.fareDataNeighborhoods = data;
    console.log(this.fareDataNeighborhoods);
  }

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
