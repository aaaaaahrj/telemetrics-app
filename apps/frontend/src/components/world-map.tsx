"use client";

import React, { useEffect, useState } from 'react';

interface WorldMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: { lat: number; lng: number; popupText?: string }[];
}

export function WorldMap({
  center = [0, 0],
  zoom = 2,
  markers = [],
}: WorldMapProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically load Leaflet CSS
    // @ts-ignore: CSS module import
    import('leaflet/dist/leaflet.css');

    // Dynamically import Leaflet and configure icon assets
    import('leaflet').then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: new URL(
          'leaflet/dist/images/marker-icon-2x.png',
          import.meta.url
        ).href,
        iconUrl: new URL(
          'leaflet/dist/images/marker-icon.png',
          import.meta.url
        ).href,
        shadowUrl: new URL(
          'leaflet/dist/images/marker-shadow.png',
          import.meta.url
        ).href,
      });
    });

    // Dynamically import react-leaflet components
    import('react-leaflet').then((RL) => {
      setMapComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
      });
    });
  }, []);

  if (!MapComponents) {
    return null;
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="flex items-center justify-between lg:pr-6 lg:pl-0 px-4">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          width: '100%',
          height: 300,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
        }}
        aria-label="World map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]}>
            {marker.popupText && <Popup>{marker.popupText}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
