import _ from "lodash";
import React from "react";
import Component from "./base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import Card from "material-ui/lib/card/card";
import CardTitle from "material-ui/lib/card/card-title";
import CardText from "material-ui/lib/card/card-text";
import TextField from "material-ui/lib/text-field";
import Slider from "material-ui/lib/slider";
import FontIcon from "material-ui/lib/font-icon";
import BoroughSettings from "./borough_settings.jsx";
import HighlightFeatureSettings from "./highlight_feature_settings.jsx";

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
      value: this.props.location.map((num) => num.toFixed(2)),
      requestChange: this.locationChanged
    };

    return (
      <Card initiallyExpanded={true} className="settings-card">
        <CardTitle
          title="Settings"
          actAsExpander={true}
          showExpandableButton={true}>
        </CardTitle>
        <CardText expandable={true}>
          <div className="row">
            <FontIcon className="col-1 material-icons">place</FontIcon>
            <TextField
              className="col-10"
              hintText="Hint Text"
              valueLink={valueLink} />
          </div>
          <div className="row">
            <FontIcon className="col-1 material-icons">date_range</FontIcon>
            <Slider className="col-10" name="date"/>
          </div>
          <HighlightFeatureSettings/>
          <BoroughSettings/>
        </CardText>
      </Card>
    );
  }

};

export default connectToStores(SettingsCard);