import React from "react";
import _ from "lodash";
import Component from "../components/base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import { Map, Marker, Popup, TileLayer, Polygon } from "react-leaflet";
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

  getGeoJSONLayersNeighborhoods() {

    if (!this.props.geoDataNeighborhoods)
      return null

    const mouseOver = (evt) => {
      evt.target.setStyle({
        opacity : 1,
        fillOpacity : 0.8
      })
    }

    const mouseOut = (evt) => {
      evt.target.setStyle({
        opacity : 0.2,
        fillOpacity : 0.2
      })
    }

    return _.flatten(_.map(this.props.activeBoroughs, (isActive, i) => {
      if (!isActive)
        return null

      const borough = this.props.boroughsMap[i];
      return this.props.geoDataNeighborhoods[borough].map((hood, i) => {

        // convert names to start with upercase
        const name = _.chain(hood.name).words().map(_.capitalize).join(" ").value();

        return <Polygon
            positions={hood.polygon}
            color="blue"
            key={hood.name + i}
            onLeafletMouseOut={mouseOut}
            onLeafletMouseOver={mouseOver}
            color='lime'>
          <Popup>
            <span>Neighborhood {name}</span>
          </Popup>
        </Polygon>
      });
    }));
  }


  render() {

    const geoLayersNeighborhoods = this.getGeoJSONLayersNeighborhoods();

    return (
      <Map center={this.props.location} zoom={13} onLeafletMoveend={_.debounce(this.locationChanged, 10)} ref="map">
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoLayersNeighborhoods}
        <Marker position={this.props.location}/>
      </Map>
    );
  }
};

export default connectToStores(TaxiMap);


