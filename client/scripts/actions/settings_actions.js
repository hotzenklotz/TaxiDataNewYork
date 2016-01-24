import alt from "../alt";

class SettingsActions {

  constructor() {
    this.generateActions(
      "updateLocation",
      "updateMapParams",
      "updateDates",
      "updateHighlightFeature",
      "toggleBorough",
      "updateAnimationState"
    )
  }
}

export default alt.createActions(SettingsActions)
