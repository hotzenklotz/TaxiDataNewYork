import alt from "../alt";

class APIActions {

  constructor() {
    this.generateActions(
      "receiveGeoData",
      "receiveGeoDataNeighborhoods"
    )
  }
}

export default alt.createActions(APIActions)