import alt from "../alt";

class APIActions {

  constructor() {
    this.generateActions(
      "receiveGeoData",
      "receiveGeoDataNeighborhoods",
      "receiveRideCountData",
      "receiveFareData"
    )
  }
}

export default alt.createActions(APIActions)
