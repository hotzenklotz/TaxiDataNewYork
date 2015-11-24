import alt from "../alt";

class SettingsActions {

  constructor() {
    this.generateActions(
      "updateLocation",
      "updateHighlightFeature",
      "toggleBorough"
    )
  }
}

export default alt.createActions(SettingsActions)