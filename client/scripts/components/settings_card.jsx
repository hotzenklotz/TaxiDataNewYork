import _ from "lodash";
import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import Card from "material-ui/lib/card/card";
import CardExpandable from "material-ui/lib/card/card-expandable";
import CardTitle from "material-ui/lib/card/card-title";
import CardText from "material-ui/lib/card/card-text";
import TextField from "material-ui/lib/text-field";
import Checkbox from "material-ui/lib/checkbox";
import List from "material-ui/lib/lists/list";
import ListItem from "material-ui/lib/lists/list-item";
import Slider from "material-ui/lib/slider";
import RadioButton from "material-ui/lib/radio-button";
import RadioButtonGroup from "material-ui/lib/radio-button-group";

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

  highlightFeatureChanged(evt, value) {
    const feature = parseInt(value.slice(-1));
    SettingsActions.updateHighlightFeature(feature);
  }

  getHighlightFeatureOptions() {

    return (
      <RadioButtonGroup
        name="highlightFeature"
        onChange={this.highlightFeatureChanged}
        style={{marginLeft: 16}}
        defaultSelected={`feature_${this.props.highlightFeature}`}
      >
        <RadioButton
          value="feature_0"
          label="Display Fare Price"
          style={{marginBottom: 20}}
          labelStyle={{marginLeft: 16, fontSize: 16}}
        />
        <RadioButton
          value="feature_1"
          label="Display Rides Count"
          style={{marginBottom: 20}}
          labelStyle={{marginLeft: 16, fontSize: 16}}
        />
      </RadioButtonGroup>
    );
  }

  getBoroughCheckboxes() {

    return _.map(this.props.boroughs, (i, name) => {
      const id = `borough_${name}`;
      const isChecked = this.props.activeBoroughs[i];

      const checkbox = (
        <Checkbox
          name={id}
          onCheck={SettingsActions.toggleBorough.bind(this, i)}
          defaultChecked={isChecked}
          />
        );

      return (
        <ListItem
          key={id}
          leftCheckbox={checkbox}
          primaryText={name}
        />
      );
    });
  }

  render() {

    const valueLink = {
      value: this.props.location.map((num) => num.toFixed(2)),
      requestChange: this.locationChanged
    };

    const boroughCheckboxes = this.getBoroughCheckboxes();
    const highlightFeatureOptions = this.getHighlightFeatureOptions();

    return (
      <Card initiallyExpanded={true} className="settings-card">
        <CardTitle
          title="Settings"
          actAsExpander={true}
          showExpandableButton={true}>
        </CardTitle>
        <CardText expandable={true}>
          <TextField
            hintText="Hint Text"
            valueLink={valueLink} />

          <Slider
            name="date"
          />

          {highlightFeatureOptions}

          <List>
            {boroughCheckboxes}
          </List>
        </CardText>
      </Card>
    );
  }

};

export default connectToStores(SettingsCard);