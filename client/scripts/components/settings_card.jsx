import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";
import _ from "lodash";

import NYCStore from "../stores/nyc_store.js";
import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";

class SettingsCard extends Component {

  static getStores() {
    return [SettingsStore, NYCStore];
  }

  static getPropsFromStores() {
    return _.extend({}, SettingsStore.getState(), NYCStore.getState());
  }

  locationChanged(value) {
    if (_.isString(value) && _.contains(value, ",")) {

      const loc = value.split(",").map(parseFloat);
      SettingsActions.updateLocation(loc);
    }
  }

  getBoroughCheckboxes() {

    return _.map(this.props.boroughs, (i, name) => {
      const id = `borough_${name}`;
      const isChecked = this.props.activeBoroughs[i];

      return (
        <div key={id}>
          <input
            type="checkbox"
            id={id} defaultChecked={isChecked}
            onChange={SettingsActions.toggleBorough.bind(this, i)}/>
          <label htmlFor={id}>{name}</label>
        </div>
      );
    });
  }

  render() {

    const valueLink = {
      value: this.props.location.map((num) => num.toFixed(2)),
      requestChange: this.locationChanged
    };

    const boroughCheckboxes = this.getBoroughCheckboxes();

    return (
      <div className="settings-card">
        <div className="card">
          <div className="card-content">
            <span className="card-title">Settings</span>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">place</i>
                <input id="icon_prefix" type="text" valueLink={valueLink}/>
              </div>
            </div>
            <div className="row">
              {boroughCheckboxes}
            </div>
          </div>
        </div>
      </div>
    );
  }

};

export default connectToStores(SettingsCard);