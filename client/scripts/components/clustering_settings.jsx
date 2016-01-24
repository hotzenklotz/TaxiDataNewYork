import _ from "lodash";
import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import RaisedButton from "material-ui/lib/raised-button";

import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";

class ClusteringSettings extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  startAnimation(evt) {
    // Start animating the KMeans clustering visualization
    if (this.props.animationState == SettingsStore.ANIMATION_NOT_STARTED || this.props.animationState == SettingsStore.ANIMATION_FINISHED) {
      _.range(0, SettingsStore.ANIMATION_FINISHED + 1).forEach(i => {
        const delay = i * 1000; // 5000ms
        _.delay(SettingsActions.updateAnimationState, delay, i);

      });
    }
  }

  render() {

    return (
      <RaisedButton
        label="Start KMeans Clustering"
        onClick={this.startAnimation}
      />
    );
  }
};

export default connectToStores(ClusteringSettings);
