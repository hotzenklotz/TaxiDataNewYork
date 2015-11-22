import React from "react";
import _ from "lodash";
import Component from "../components/base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import { Map, Marker, Popup, TileLayer, GeoJson } from "react-leaflet";
import NYCStore from "../stores/nyc_store.js";
import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";


class TaxiMap extends Component {

  static getStores() {
    return [SettingsStore, NYCStore];
  }

  static getPropsFromStores() {
    return _.extend({}, SettingsStore.getState(), NYCStore.getState());
  }

  locationChanged(evt) {
    // scrolling / zooming also fires this event... kinda jumpy...
    const loc = _.values(this.refs.map.leafletElement.getCenter());
    SettingsActions.updateLocation(loc);
  }

  render() {

    const geoJSON = NYCStore.getGeoDataForBorough("Manhattan") || [];
    debugger

    return (
      <Map center={this.props.location} zoom={13} onLeafletMoveend={_.debounce(this.locationChanged, 10)} ref="map">
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJson data={geoJSON}/>
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


