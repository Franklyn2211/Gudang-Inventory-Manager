import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { warehouses } from "@/lib/mockData";
import type { LatLngExpression } from "leaflet";

const center: LatLngExpression = [-6.2, 106.8];

export default function WarehouseMap() {
  return (
    <MapContainer center={center} zoom={11} className="w-full h-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {warehouses.map((wh) => (
        <Marker key={wh.id} position={[wh.coordinates.lat, wh.coordinates.lng]}>
          <Popup>
            <strong>{wh.name}</strong>
            <br />
            {wh.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
