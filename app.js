/* global window,document */
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import DeckGL, { PolygonLayer } from "deck.gl";
import {TripsLayer} from '@deck.gl/geo-layers';
import {StaticMap} from 'react-map-gl';

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibmF1aGMiLCJhIjoiY2o5ODFjemMzMGpwYzJ3cXFhMzVpNmlwZSJ9.odHAMFLa6Q7V1OeRWQbyjQ";

const STYLE = {
  LIGHT: {
    MAP: "mapbox://styles/mapbox/light-v10",
    VENDOR: {
      YELLOW: [252,161,6],
      GREEN: [26,142,156]
    },
    BUILDING: [126,168,171]
  },
  DARK: {
    MAP: "mapbox://styles/mapbox/dark-v10",
    VENDOR: {
      YELLOW: [252,161,6],
      GREEN: [195,214,27]
    },
    BUILDING: [253, 128, 93]
    // BUILDING: [126,168,171]
  },
  OUTDOOR: {
    MAP: "mapbox://styles/mapbox/outdoors-v11",
    VENDOR: {
      YELLOW: [252,161,6],
      GREEN: [195,214,27]
    },
    BUILDING: [217, 87, 87]
  },
  SATELLITE: {
    MAP: "mapbox://styles/mapbox/satellite-v9",
    VENDOR: {
      YELLOW: [252,161,6],
      GREEN: [184,251,60]
    },
    BUILDING: [195,214,27]
  }
}
// const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

  // Source data CSV
const DATA_URL = {
  BUILDINGS: "data/buildings.json", // eslint-disable-line
  TRIPS: "data/trips.json" // eslint-disable-line
};


const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.71,
  // longitude: 139.638,
  // latitude: 35.45,
  zoom: 14,
  maxZoom: 16,
  pitch: 35,
  bearing: 0
}

const LIGHT_SETTINGS = {
  lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2
};



export default function App({
  buildings = DATA_URL.BUILDINGS,
  trips = DATA_URL.TRIPS,
  style = STYLE.DARK
}) {

  const loopLength = 1800;
  const [time, setTime] = useState(0);
  const [animation] = useState({});

  const animate = () => {
    setTime(t => (t + 1) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(
    () => {
      animation.id = window.requestAnimationFrame(animate);
      return () => window.cancelAnimationFrame(animation.id);
    },
    [animation]
  );

  const layers = [
    new TripsLayer({
      id: 'trips',
      data: trips,
      getPath: d => d.path,
      // deduct start timestamp from each data point to avoid overflow
      // getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
      getTimestamps: d => d.timestamps,
      getColor: d => d.vendor === 0 ? style.VENDOR.YELLOW : style.VENDOR.GREEN,
      opacity: 0.8,
      widthMinPixels: 3,
      rounded: true,
      trailLength: 100,
      currentTime: time
    }),

    new PolygonLayer({
      id: "buildings",
      data: buildings,
      extruded: true,
      wireframe: false,
      fp64: true,
      opacity: 0.15,
      getPolygon: f => f.polygon,
      getElevation: f => f.height,
      // getFillColor: f => [74, 80, 87],
      // getFillColor: f => [238, 117, 106],
      getFillColor: style.BUILDING,
      lightSettings: LIGHT_SETTINGS
    })
  ];

  return (
    <DeckGL
      layers = {layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <StaticMap 
        reuseMaps 
        mapStyle={style.MAP} 
        preventStyleDiffing={true}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      />
    </DeckGL>
  )
}

export function renderToDOM(container){
  render(<App />, container);
}