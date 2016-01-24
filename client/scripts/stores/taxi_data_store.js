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

    this.loadingLocks = 0;
    this.isLoading = true;
    this.fareDataNeighborhoods = null;
    this.ridesDataNeighborhoods = null;
    this.kmeansClusters = null;

    const [startTime, endTime] = SettingsStore.getDates();

    this.loadingLocks++;
    API.getRideCountDataNeighborhoods(startTime, endTime)
    API.getFareDataNeighborhoods(startTime, endTime)
    API.getKMeansClusters(SettingsStore.getState().currentIteration);
  }

  static getPriceDataForNeighborhood(index) {

    const priceData = this.getState().priceDataNeighborhoods;

    if (priceData && priceData[index]) {
      return priceData[index];
    }
    else {
      this.loadingLocks++;
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
    else {
      this.loadingLocks++;
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
    } else {
      return 0;
    }
  }

  static getOutgoingRidesForNeighborhood(index) {

    const countData = this.getState().ridesDataNeighborhoods;

    if (countData && countData["rides"][index]) {
      return countData["rides"][index]["outgoing_rides"];
    }
  }

  onUpdateDates([startTime, endTime]) {
    this.isLoading = true;
    this.loadingLocks++;
    if(SettingsStore.getState().highlightFeature == "rideCount") {
      API.getRideCountDataNeighborhoods(startTime, endTime);
    } else {
     API.getFareDataNeighborhoods(startTime, endTime);
    }
  }

  onUpdateIteration(iteration) {
   this.isLoading = true;
   this.loadingLocks++;
   API.getKMeansClusters(SettingsStore.getState().currentIteration);
  }

  onReceiveRideCountData(data) {
    this.ridesDataNeighborhoods = data;
    this.loadingLocks--;
    this.isLoading = false;
  }

  onReceiveFareData(data) {
    this.fareDataNeighborhoods = data;
    this.loadingLocks--;
    this.isLoading = false;
  }

  onReceiveKMeansCluster(data) {
   this.kmeansClusters = data;
  }

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
