import _ from "lodash";
import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import Checkbox from "material-ui/lib/checkbox";
import List from "material-ui/lib/lists/list";
import ListItem from "material-ui/lib/lists/list-item";

import NYCStore from "../stores/nyc_store.js";
import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";

class BoroughSettings extends Component {

  static getStores() {
    return [SettingsStore, NYCStore];
  }

  static getPropsFromStores() {
    return _.extend({}, SettingsStore.getState(), NYCStore.getState());
  }

  getBoroughCheckboxes() {

    return _.map(this.props.boroughsMap, (name, i) => {
      const isChecked = this.props.activeBoroughs[i];
      const capitalized_name = _.chain(name).words().map(_.capitalize).join(" ").value();

      const checkbox = (
        <Checkbox
          name={name}
          onCheck={SettingsActions.toggleBorough.bind(this, i)}
          defaultChecked={isChecked}
          />
        );

      return (
        <ListItem
          key={name}
          leftCheckbox={checkbox}
          primaryText={capitalized_name}
        />
      );
    });
  }

  render() {
    return (
      <List>
        {this.getBoroughCheckboxes()}
      </List>
    );
  }
};

export default connectToStores(BoroughSettings);