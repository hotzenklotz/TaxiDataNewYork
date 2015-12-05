import alt from "../alt";

class APIActions {

  constructor() {
    this.generateActions(
      "receiveGeoData",
      "receiveGeoDataNeighborhoods",
      "receiveTaxiData"
    )
  }
}

export default alt.createActions(APIActions)
