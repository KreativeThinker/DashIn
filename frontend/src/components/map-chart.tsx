// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import regionData from "../assets/regions.geojson";
//
// export default function MapView() {
//   const onEachRegion = (feature: any, layer: any) => {
//     layer.bindPopup(feature.properties.name); // Show region name
//     layer.setStyle({
//       fillColor: "blue",
//       weight: 1,
//       color: "white",
//       fillOpacity: 0.5,
//     });
//   };
//
//   return (
//     <MapContainer center={[10, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <GeoJSON data={regionData} onEachFeature={onEachRegion} />
//     </MapContainer>
//   );
// }
