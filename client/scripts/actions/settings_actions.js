import alt from "../alt";

class SettingsActions {

  constructor() {
    this.generateActions(
      "updateLocation",
      "toggleBorough"
    )
  }
}

export default alt.createActions(SettingsActions)