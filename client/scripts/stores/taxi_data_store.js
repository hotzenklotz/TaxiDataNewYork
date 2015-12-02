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

    this.foo = {}

    const [startTime, endTime] = SettingsStore.getDates();
    //API.getTaxiData(startTime, endTime)
  }

  onUpdateDates([startTime, endTime]) {
    console.log("Requesting new data")
    //API.getTaxiData(startTime, endTime);
  }

  onReceiveTaxiData(data) {
    this.foo = data;
  }

};

export default alt.createStore(TaxiDataStore, "TaxiDataStore");
