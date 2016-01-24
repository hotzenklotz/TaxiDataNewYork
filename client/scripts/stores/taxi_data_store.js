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

    this.kmeansCluster = {
    // iteration : [
    //  [[lat, long], radius], ...
    //]
      0 : [
        [[40.72003879540742, -73.2247703552246], 3000],
        [[40.04003879540742, -73.9247703552246], 2500]
      ],
      1 : [
        [[40.74003879540742, -73.9247703552246], 3000],
        [[40.34003879540742, -74.3247703552246], 2500]
      ],
      2 : [
        [[40.74003879540742, -73.9247703552246], 3000],
        [[40.34003879540742, -74.3247703552246], 1000]
      ],
      3 : [
        [[40.74003879540742, -73.9247703552246], 1000],
        [[40.34003879540742, -74.3247703552246], 3000]
      ],
      4 : [
        [[40.74003879540742, -73.9247703552246], 2000],
        [[40.5003879540742, -74.3247703552246], 2000]
      ],
      5 : [
        [[40.74003879540742, -73.9247703552246], 4000],
        [[41.34003879540742, -73.3247703552246], 500]
      ],
      6 : [
        [[40.74003879540742, -73.9247703552246], 3400],
        [[40.34003879540742, -73.3247703552246], 2900]
      ],
      7 : [
        [[40.54003879540742, -73.5247703552246], 4400],
        [[40.34003879540742, -74.3247703552246], 2000]
      ],
      8 : [
        [[40.04003879540742, -73.9247703552246], 3000],
        [[39.94003879540742, -73.9247703552246], 3000]
      ],
      9 : [
        [[40.94003879540742, -73.9247703552246], 1000],
        [[41.04003879540742, -73.7247703552246], 3000]
      ],
    };

    const [startTime, endTime] = SettingsStore.getDates();

    this.loadingLocks++;
    API.getRideCountDataNeighborhoods(startTime, endTime)
    API.getFareDataNeighborhoods(startTime, endTime)
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

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
