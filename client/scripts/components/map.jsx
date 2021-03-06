import React from "react";
import _ from "lodash";
import Component from "../components/base_component.jsx";
import connectToStores from "alt/utils/connectToStores";

import { Map, Marker, Popup, TileLayer, Polygon, Circle } from "react-leaflet";
import NYCStore from "../stores/nyc_store.js";
import TaxiDataStore from "../stores/taxi_data_store.js";
import SettingsStore from "../stores/settings_store.js";
import SettingsActions from "../actions/settings_actions.js";
import FontIcon from "material-ui/lib/font-icon";


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

  heatMapColorforValue(min, max, value){
    value = value/(max - min);
    var hue=((1-value)*120).toString(10);
    if(hue < 0)
     hue = 0;

    return "hsl(" + hue + ",100%,50%)";
  }

  getColorForBorough(name)
  {
    if(this.props.highlightFeature == "fares") {
      return this.heatMapColorforValue(0, 10, Math.pow(TaxiDataStore.getAverageFarePerMileForNeighborhood(name), 2)/4)
    }
    else {
     return this.heatMapColorforValue( TaxiDataStore.getMinOutgoingRidesForNeighborhood(),
                                       TaxiDataStore.getMaxOutgoingRidesForNeighborhood()/6,
                                       Math.pow(TaxiDataStore.getOutgoingRidesForNeighborhood(name), 2)/150)
    }
  }

  // Create a Leaflet.Polygon for every NYC neighborhood
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
      // Don't create Polygons for deactivated/hidden boroughs
      if (!isActive)
        return null

      // Get the geo data for all neighborhoods grouped by borough
      const borough = this.props.boroughsMap[i];
      return this.props.geoDataNeighborhoods[borough].map((hood, i) => {

        // convert names to start with upercase
        const name = _.chain(hood.name).words().map(_.capitalize).join(" ").value();

        const outgoingRides = TaxiDataStore.getOutgoingRidesForNeighborhood(hood.name);
        const incomingRides = TaxiDataStore.getIncomingRidesForNeighborhood(hood.name);
        const avgFare = TaxiDataStore.getAverageFarePerMileForNeighborhood(hood.name);
        const color = this.getColorForBorough(hood.name);

        return <Polygon
            positions={hood.polygon}
            color={color}
            key={hood.name + i}
            onLeafletMouseOut={mouseOut}
            onLeafletMouseOver={mouseOver}>
          <Popup>
            <div className="info-popup">
              <h4>Neighborhood {name}</h4>
              <p>
                <FontIcon className="material-icons">local_taxi</FontIcon>Rides:
                <p><FontIcon className="material-icons">arrow_forward</FontIcon>Outgoing: {outgoingRides} </p>
                <p><FontIcon className="material-icons">arrow_back</FontIcon>Incoming: {incomingRides} </p>
              </p>
              <p><FontIcon className="material-icons">attach_money</FontIcon>average fare per mile: ${avgFare.toFixed(2)}</p>
            </div>
          </Popup>
        </Polygon>
      });
    }));
  }

  getKMeansCluster() {
    if (this.props.animationState > SettingsStore.ANIMATION_NOT_STARTED) {
      const iteration = this.props.animationState;
      return _.map(this.props.kmeansCluster[iteration], ([latLng, radius], i) => {
        return <Circle center={latLng} radius={radius} key={`cluster_${iteration}_${i}`}/>;
      });
    } else {
      return <span/>
    }
  }

  render() {

    const geoLayersNeighborhoods = this.getGeoJSONLayersNeighborhoods();
    const kmeansCluster = this.getKMeansCluster();

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
        {kmeansCluster}
      </Map>
    );
  }
};

export default connectToStores(TaxiMap);
