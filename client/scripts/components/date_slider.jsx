import React from "react";
import ReactSlider from "react-slider";
import connectToStores from "alt/utils/connectToStores";
import Component from "./base_component.jsx";
import SettingsStore from "../stores/settings_store";
import SettingsActions from "../actions/settings_actions";

class DateSlider extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  dateChanged(values) {
    SettingsActions.updateDates(values);
  }

  render() {

    const sliderValues = [this.props.timeStart, this.props.timeEnd]
    const oneDay = 86400; // unix timestamp diff between two days

    const startDate = new Date(this.props.timeStart * 1000).toISOString().slice(0,10);
    const endDate = new Date(this.props.timeEnd * 1000).toISOString().slice(0,10);

    return (<div>
        <ReactSlider
          defaultValue={sliderValues}
          onAfterChange={this.dateChanged}
          min={this.props.minTime}
          max={this.props.maxTime}
          step={oneDay}
          withBars/>
        <div className="col-6" style={{marginTop: 20}}>{startDate}</div>
        <div className="col-6" style={{marginTop: 20}}>{endDate}</div>
      </div>
    )
  }
};

export default connectToStores(DateSlider);
