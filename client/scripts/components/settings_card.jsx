import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";
import _ from "lodash";

import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";

class SettingsCard extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  locationChanged(value) {
    if (_.isString(value) && _.contains(value, ",")) {

      const loc = value.split(",").map(parseFloat);
      SettingsActions.updateLocation(loc);
    }
  }

  render() {

    const valueLink = {
      value: this.props.location,
      requestChange: this.locationChanged
    };

    return (
      <div className="settings-card">
        <div className="card">
          <div className="card-content">
            <span className="card-title"><i className="material-icons left">settings</i> Settings</span>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">place</i>
                <input id="icon_prefix" type="text" valueLink={valueLink}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

};

export default connectToStores(SettingsCard);