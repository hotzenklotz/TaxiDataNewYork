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

  getGeoJSONLayers() {

    return _.map(this.props.activeBoroughs, (isActive, i) => {
      const name = _.keys(this.props.boroughs)[i];

      const geoJSON = NYCStore.getGeoDataForBorough(name);

      if (geoJSON && isActive) {
        return <GeoJson data={geoJSON} key={name}/>
      };
    })
  }

  getGeoJSONLayersNeighborhoods() {

    const mouseOver = (evt) => {
      evt.layer.setStyle({
        opacity : 1,
        fillOpacity : 0.8
      })
    }

    const mouseOut = (evt) => {
      evt.layer.setStyle({
        opacity : 0.2,
        fillOpacity : 0.2
      })
    }

    return _.map(this.props.activeNeighborhoods, (isActive, i) => {
      const name = this.props.neighborhoodNames[i];
      const key = name + i
      const geoJSON = NYCStore.getGeoDataForNeighborhood(i);

      const layerStyle = {
          color: "#ff7800",
          weight: 2,
          opacity: 0.2,
          fillOpacity: 0.2
      };

      if (geoJSON) {
        return <GeoJson
            data={geoJSON}
            key={key}
            style={layerStyle}
            onLeafletMouseOut={mouseOut}
            onLeafletMouseOver={mouseOver}>
          <Popup>
            <span>Neighborhood {name}</span>
          </Popup>
        </GeoJson>
      };
    })
  }


  render() {

    const geoLayers = this.getGeoJSONLayers();
    const geoLayersNeighborhoods = this.getGeoJSONLayersNeighborhoods();

    return (
      <Map center={this.props.location} zoom={13} onLeafletMoveend={_.debounce(this.locationChanged, 10)} ref="map">
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoLayers}
        {geoLayersNeighborhoods}
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


