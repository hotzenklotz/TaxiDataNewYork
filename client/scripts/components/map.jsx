import React from "react";
import Component from "../components/baseComponent.jsx";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

class TaxiMap extends Component {

  render() {

    const position = [52.3937903, 13.1296473];

    return (
      <Map center={position} zoom={13}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }
};

export default TaxiMap;


