'use client';

import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl';
import { DeckGL } from '@deck.gl/react';
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';

const OSM_TILE_SERVER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const INITIAL_VIEW_STATE = {
  longitude: 127.0, // Centered on Seoul
  latitude: 37.55,
  zoom: 11,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [ 'a', 'b', 'c' ].map(s => OSM_TILE_SERVER.replace('{s}', s)),
      tileSize: 256,
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export default function RoadMonitorMap() {
  const [paths, setPaths] = useState(null);
  const [vehicles, setVehicles] = useState(null);

  useEffect(() => {
    // Fetch road paths once
    fetch('http://localhost:8000/api/road-paths')
      .then(res => res.json())
      .then(data => setPaths(data))
      .catch(console.error);

    // Fetch vehicle data periodically
    const interval = setInterval(() => {
      fetch('http://localhost:8000/api/vehicles')
        .then(res => res.json())
        .then(data => setVehicles(data))
        .catch(console.error);
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const layers = [
    paths && new PathLayer({
      id: 'path-layer',
      data: paths.features,
      getPath: d => d.geometry.coordinates,
      getColor: [255, 0, 0, 150], // Red
      getWidth: 5,
      widthMinPixels: 2,
    }),
    vehicles && new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: vehicles.features,
      getPosition: d => d.geometry.coordinates,
      getFillColor: [0, 255, 0, 255], // Green
      getRadius: 50,
      radiusMinPixels: 5,
    })
  ].filter(Boolean);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
        reuseMaps
        mapStyle={MAP_STYLE}
        preventStyleDiffing
      />
    </DeckGL>
  );
}
