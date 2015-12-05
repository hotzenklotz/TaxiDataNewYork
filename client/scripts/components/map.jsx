import React from "react";
import _ from "lodash";
import Component from "../components/base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import { Map, Marker, Popup, TileLayer, Polygon } from "react-leaflet";
import NYCStore from "../stores/nyc_store.js";
import TaxiDataStore from "../stores/taxi_data_store.js";
import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";


class TaxiMap extends Component {

  static getStores() {
    return [SettingsStore, NYCStore, TaxiDataStore];
  }

  static getPropsFromStores() {
    return _.extend({}, SettingsStore.getState(), NYCStore.getState(), TaxiDataStore.getState());
  }

  // Event handler for dragging the map
  locationChanged(evt) {
    const zoom = evt.target.getZoom();
    const loc = _.values(this.refs.map.leafletElement.getCenter());
    SettingsActions.updateMapParams(loc, zoom);
  }

  mapPriceToColor(price)
  {
    return '#000000';
  }

  heatMapColorforValue(min, max, value){
    value = (max - min) / value;
    var h = (1.0 - value) * 240
    return "hsl(" + h + ", 100%, 50%)";
  }

  // Create a Leaflet.Polygon for every NYC neighborhood
  getGeoJSONLayersNeighborhoods() {

    if (!this.props.geoDataNeighborhoods)
      return null

    const mouseOut = (evt) => {
      evt.target.setStyle({
        opacity : 0.2,
        fillOpacity : 0.2
      })
    }

    return _.flatten(_.map(this.props.activeBoroughs, (isActive, i) => {
      // Don't create Polygons for deactivated/hidden boroughs
      if (!isActive)
        return null

      // Get the geo data for all neighborhoods grouped by borough
      const borough = this.props.boroughsMap[i];
      return this.props.geoDataNeighborhoods[borough].map((hood, i) => {

        // convert names to start with upercase
        const name = _.chain(hood.name).words().map(_.capitalize).join(" ").value();
        const outgoingRides = TaxiDataStore.getOutgoingRidesForNeighborhood(hood.name);

        const mouseOver = (evt) => {
          evt.target.setStyle({
            opacity : 1,
            fillOpacity : 0.8
          })
        }

        return <Polygon
            positions={hood.polygon}
            color={this.heatMapColorforValue(0, 200000, outgoingRides)}
            key={hood.name + i}
            onLeafletMouseOut={mouseOut}
            onLeafletMouseOver={mouseOver}>
          <Popup>
            <span>Neighborhood {name},  {outgoingRides} outgoing rides</span>
          </Popup>
        </Polygon>
      });
    }));
  }


  render() {

    const geoLayersNeighborhoods = this.getGeoJSONLayersNeighborhoods();

    return (
      <Map center={this.props.location}
        zoom={this.props.zoom}
        scrollWheelZoom={true}
        onLeafletMoveend={_.debounce(this.locationChanged, 10)} ref="map">
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoLayersNeighborhoods}
      </Map>
    );
  }
};

export default connectToStores(TaxiMap);
