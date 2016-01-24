import React from "react";
import ReactSlider from "react-slider";
import connectToStores from "alt/utils/connectToStores";
import Component from "./base_component.jsx";
import SettingsStore from "../stores/settings_store";
import SettingsActions from "../actions/settings_actions";

class IterationSlider extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  iterationChanged(iteration) {
    SettingsActions.updateIteration(iteration);
  }

  render() {

    const min = 0;
    const max = 10;
    const step = 1;
    const sliderValues = min;
    const currentIteration = this.props.currentIteration;


    return (<div>
        <ReactSlider
          defaultValue={sliderValues}
          onAfterChange={this.iterationChanged}
          min={min}
          max={max}
          withBars>
          <div className="col-6" style={{marginTop: 20}}>{currentIteration}</div>
        </ReactSlider>
      </div>
    )
  }
};

export default connectToStores(IterationSlider);
