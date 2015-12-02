import alt from "../alt";

class SettingsActions {

  constructor() {
    this.generateActions(
      "updateLocation",
      "updateDates",
      "updateHighlightFeature",
      "toggleBorough",
      "onMouseOverNeigborHood",
      "onMouseOutNeigborHood"
    )
  }
}

export default alt.createActions(SettingsActions)