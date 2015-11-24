import _ from "lodash";
import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import RadioButton from "material-ui/lib/radio-button";
import RadioButtonGroup from "material-ui/lib/radio-button-group";

import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";

class HighlightFeatureSettings extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  highlightFeatureChanged(evt, value) {
    SettingsActions.updateHighlightFeature(value);
  }

  render() {

    return (
      <RadioButtonGroup
        name="highlightFeature"
        onChange={this.highlightFeatureChanged}
        style={{marginLeft: 16}}
        defaultSelected={this.props.highlightFeature}
      >
        <RadioButton
          value="fares"
          label="Display Fare Price"
          style={{marginBottom: 20}}
          labelStyle={{marginLeft: 16, fontSize: 16}}
        />
        <RadioButton
          value="rideCount"
          label="Display Rides Count"
          style={{marginBottom: 20}}
          labelStyle={{marginLeft: 16, fontSize: 16}}
        />
      </RadioButtonGroup>
    );
  }
};

export default connectToStores(HighlightFeatureSettings);