import React from "react";
import Component from "../components/base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import SettingsStore from "../stores/settings_store.js";


class TaxiMap extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  render() {

    return (
      <Map center={this.props.location} zoom={13}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={this.props.location}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }
};

export default connectToStores(TaxiMap);


