import React from "react";
import Component from "../components/base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";


class TaxiMap extends Component {

  static getStores() {
    return [SettingsStore];
  }

  static getPropsFromStores() {
    return SettingsStore.getState();
  }

  locationChanged(evt) {
    const loc = _.values(this.refs.map.leafletElement.getCenter());
    SettingsActions.updateLocation(loc);
  }

  render() {

    return (
      <Map center={this.props.location} zoom={13} onLeafletMoveend={this.locationChanged} ref="map">
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


