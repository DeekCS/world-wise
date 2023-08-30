import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCities } from "../../contexts/CitiesContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import Button from "../Button/Button.jsx";
import { useUrlPosition } from "../../hooks/useUrlPosition.js";
export default function Map() {
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    error,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
  const navigate = useNavigate();

  useEffect(() => {
    if (lat && lng) {
      // if lat and lng are in the url params, set the map position to those coordinates
      setMapPosition([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <Button
        type={"position"}
        onClick={getPosition}
        disabled={isLoadingPosition}
      >
        {isLoadingPosition ? "Loading..." : "My position"}
      </Button>
      <MapContainer
        center={lat && lng ? [lat, lng] : mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker key={city.id} position={city.position}>
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {mapPosition && <ChangeCenter position={mapPosition} />}
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  const map = useMapEvents({
    click: (e) => {
      e.originalEvent.preventDefault();
      console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}
