import alt from "../alt";

class APIActions {

  constructor() {
    this.generateActions(
      "receiveGeoData"
    )
  }
}

export default alt.createActions(APIActions)