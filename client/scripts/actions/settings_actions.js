import alt from "../alt";

class SettingsActions {

  constructor() {
    this.generateActions(
      "updateLocation",
      "updateMapParams",
      "updateDates",
      "updateHighlightFeature",
      "toggleBorough",
      "increaseLoadingLocks",
      "decreaseLoadingLocks",
      "onMouseOverNeigborHood",
      "onMouseOutNeigborHood"
    )
  }
}

export default alt.createActions(SettingsActions)
