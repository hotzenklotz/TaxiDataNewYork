import alt from "../alt";

class SettingsActions {

  constructor() {
    this.generateActions(
      "updateLocation",
      "updateMapParams",
      "updateDates",
      "updateIteration",
      "updateHighlightFeature",
      "toggleBorough",
      "onMouseOverNeigborHood",
      "onMouseOutNeigborHood"
    )
  }
}

export default alt.createActions(SettingsActions)
