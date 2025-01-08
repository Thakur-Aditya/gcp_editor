"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import of the map component with no SSR
const Map = dynamic(
  () => import("react-leaflet").then(mod => {
    return import("leaflet").then(L => {
      // Handle leaflet imports
      const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = mod;
      
      // Create icon
      const icon = L.default.icon({
        iconUrl: "/marker-icon.png",
        iconRetinaUrl: "/location.png",
        shadowUrl: "/marker-shadow.png",
        iconSize: [41, 41],
        iconAnchor: [12, 41],
      });

      // MapEvents component
      function MapEvents({ onMapClick }) {
        useMapEvents({
          click: (e) => {
            onMapClick(e);
          },
        });
        return null;
      }

      // MapController component
      function MapController({ points }) {
        const map = useMap();
        
        useEffect(() => {
          if (points.length > 0) {
            const bounds = L.default.latLngBounds(points.map(point => [point.latitude, point.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }, [points, map]);
      
        return null;
      }

      // Map component
      function LeafletMap({ points, onMapClick }) {
        const initialCenter = points.length > 0 
          ? [points[0].latitude, points[0].longitude]
          : [28.6139, 77.2090];

        return (
          <MapContainer
            center={initialCenter}
            zoom={13}
            className="w-full h-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onMapClick={onMapClick} />
            <MapController points={points} />
            {points.map((marker, index) => (
              <Marker
                key={index}
                position={[marker.latitude, marker.longitude]}
                icon={icon}
              />
            ))}
          </MapContainer>
        );
      }

      return LeafletMap;
    });
  }),
  { ssr: false }
);

function PointsEditor({ points = [] }) {
  const [markers, setMarkers] = useState(points);

  useEffect(() => {
    setMarkers(points);
  }, [points]);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    const newPoint = {
      latitude: lat,
      longitude: lng,
      elevation: 0
    };
    setMarkers([...markers, newPoint]);
  };

  const handleExport = (points) => {
    const header = 'latitude,longitude,elevation';
    const rows = points.map(point => 
      `${point.latitude},${point.longitude},${point.elevation}`
    );
    const content = [header, ...rows].join('\n');

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gcp_points.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="h-[500px] w-full relative">
      <Map points={markers} onMapClick={handleMapClick} />
      
      <div className="absolute top-4 right-4 text-black bg-white p-4 rounded-lg shadow z-[1000]">
        <h3 className="font-bold mb-2">Points ({markers.length})</h3>
        <div className="max-h-48 overflow-y-auto">
          {markers.map((marker, index) => (
            <div key={index} className="text-sm mb-2">
              Point {index + 1}: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
            </div>
          ))}
        </div>
        
        <button
          onClick={() => handleExport(markers)}
          className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          disabled={markers.length === 0}
        >
          Export Points
        </button>
      </div>
    </div>
  );
}

// Export with no SSR
export default dynamic(() => Promise.resolve(PointsEditor), {
  ssr: false
});






// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import "leaflet/dist/leaflet.css";

// // Dynamic imports for Leaflet components
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );

// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );

// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );

// // MapEvents component
// const MapEvents = dynamic(
//   () => {
//     const { useMapEvents } = require("react-leaflet");
//     return function MapEvents({ onMapClick }) {
//       useMapEvents({
//         click: (e) => {
//           onMapClick(e);
//         },
//       });
//       return null;
//     };
//   },
//   { ssr: false }
// );

// // MapController component
// const MapController = dynamic(
//   () => {
//     const { useMap } = require("react-leaflet");
//     const L = require("leaflet");
//     return function MapController({ points }) {
//       const map = useMap();
      
//       useEffect(() => {
//         if (points.length > 0) {
//           const bounds = L.latLngBounds(points.map(point => [point.latitude, point.longitude]));
//           map.fitBounds(bounds, { padding: [50, 50] });
//         }
//       }, [points, map]);
    
//       return null;
//     };
//   },
//   { ssr: false }
// );

// const PointsEditor = ({ points = [] }) => {
//   const [markers, setMarkers] = useState(points);
//   const [icon, setIcon] = useState(null);

//   // Initialize Leaflet icon on client side
//   useEffect(() => {
//     const L = require("leaflet");
//     setIcon(
//       L.icon({
//         iconUrl: "/marker-icon.png",
//         iconRetinaUrl: "/location.png",
//         shadowUrl: "/marker-shadow.png",
//         iconSize: [41, 41],
//         iconAnchor: [12, 41],
//       })
//     );
//   }, []);

//   useEffect(() => {
//     setMarkers(points);
//   }, [points]);

//   const handleMapClick = (event) => {
//     const { lat, lng } = event.latlng;
//     const newPoint = {
//       latitude: lat,
//       longitude: lng,
//       elevation: 0
//     };
//     setMarkers([...markers, newPoint]);
//   };

//   const handleExport = (points) => {
//     const header = 'latitude,longitude,elevation';
//     const rows = points.map(point => 
//       `${point.latitude},${point.longitude},${point.elevation}`
//     );
//     const content = [header, ...rows].join('\n');

//     const blob = new Blob([content], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'gcp_points.csv';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   };

//   const initialCenter = points.length > 0 
//     ? [points[0].latitude, points[0].longitude]
//     : [28.6139, 77.2090];

//   if (!icon) return null; // Wait for icon to be initialized

//   return (
//     <div className="h-[500px] w-full relative">
//       <MapContainer
//         center={initialCenter}
//         zoom={13}
//         className="w-full h-full rounded-lg"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <MapEvents onMapClick={handleMapClick} />
//         <MapController points={markers} />
//         {markers.map((marker, index) => (
//           <Marker
//             key={index}
//             position={[marker.latitude, marker.longitude]}
//             icon={icon}
//           />
//         ))}
//       </MapContainer>

//       <div className="absolute top-4 right-4 text-black bg-white p-4 rounded-lg shadow z-[1000]">
//         <h3 className="font-bold mb-2">Points ({markers.length})</h3>
//         <div className="max-h-48 overflow-y-auto">
//           {markers.map((marker, index) => (
//             <div key={index} className="text-sm mb-2">
//               Point {index + 1}: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
//             </div>
//           ))}
//         </div>
        
//         <button
//           onClick={() => handleExport(markers)}
//           className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
//           disabled={markers.length === 0}
//         >
//           Export Points
//         </button>
//       </div>
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(PointsEditor), {
//   ssr: false
// });
















// "use client";
// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents,useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix Leaflet icon issue
// const icon = L.icon({
//   iconUrl: "/marker-icon.png",
//   iconRetinaUrl: "/location.png",
//   shadowUrl: "/marker-shadow.png",
//   iconSize: [41, 41],
//   iconAnchor: [12, 41],
// });

// // MapEvents component for handling clicks
// function MapEvents({ onMapClick }) {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e);
//     },
//   });
//   return null;
// }

// function MapController({ points }) {
//   const map = useMap();
  
//   useEffect(() => {
//     if (points.length > 0) {
//       // Create bounds for all points
//       const bounds = L.latLngBounds(points.map(point => [point.latitude, point.longitude]));
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [points, map]);

//   return null;
// }

// export default function PointsEditor({ points = [] }) {
//   const [markers, setMarkers] = useState(points);

//   // Update markers when points prop changes
//   useEffect(() => {
//     setMarkers(points);
//   }, [points]);

//   const handleMapClick = (event) => {
//     const { lat, lng } = event.latlng;
//     const newPoint = {
//       latitude: lat,
//       longitude: lng,
//       elevation: 0
//     };
//     setMarkers([...markers, newPoint]);
//   };

//   // Calculate initial center from points or use default
//   const initialCenter = points.length > 0 
//     ? [points[0].latitude, points[0].longitude]
//     : [28.6139, 77.2090];

//   return (
//     <div className="h-[500px] w-full relative">
//       <MapContainer
//         center={initialCenter}
//         zoom={13}
//         className="w-full h-full rounded-lg"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <MapEvents onMapClick={handleMapClick} />
//         <MapController points={markers} />
//         {markers.map((marker, index) => (
//           <Marker
//             key={index}
//             position={[marker.latitude, marker.longitude]}
//             icon={icon}
//           />
//         ))}
//       </MapContainer>

//       <div className="absolute top-4 right-4 text-black bg-white p-4 rounded-lg shadow z-[1000]">
//         <h3 className="font-bold mb-2">Points ({markers.length})</h3>
//         <div className="max-h-48 overflow-y-auto">
//           {markers.map((marker, index) => (
//             <div key={index} className="text-sm mb-2">
//               Point {index + 1}: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
//             </div>
//           ))}
//         </div>
        
//         {/* Export Button */}
//         <button
//           onClick={() => handleExport(markers)}
//           className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
//           disabled={markers.length === 0}
//         >
//           Export Points
//         </button>
//       </div>
//     </div>
//   );
// }

// // Add export function
// function handleExport(points) {
//   if (typeof document !== "undefined") {
//     // Create CSV content
//     const header = 'latitude,longitude,elevation';
//     const rows = points.map(point => 
//       `${point.latitude},${point.longitude},${point.elevation}`
//     );
//     const content = [header, ...rows].join('\n');

//     // Create and download file
//     const blob = new Blob([content], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'gcp_points.csv';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   }
// }


// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";

// // Dynamically import react-leaflet components to disable SSR
// const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
// const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
// const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
// const useMapEvents = dynamic(() => import("react-leaflet").then((mod) => mod.useMapEvents), { ssr: false });
// const useMap = dynamic(() => import("react-leaflet").then((mod) => mod.useMap), { ssr: false });

// // Dynamically import Leaflet to disable SSR
// const L = dynamic(() => import("leaflet"), { ssr: false });

// import "leaflet/dist/leaflet.css";

// // Fix Leaflet icon issue, ensure Leaflet and window are available before using them
// const icon = typeof window !== "undefined" && typeof L !== "undefined" ? L.icon({
//   iconUrl: "/marker-icon.png",
//   iconRetinaUrl: "/location.png",
//   shadowUrl: "/marker-shadow.png",
//   iconSize: [41, 41],
//   iconAnchor: [12, 41],
// }) : null;

// // MapEvents component for handling clicks
// function MapEvents({ onMapClick }) {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e);
//     },
//   });
//   return null;
// }

// function MapController({ points }) {
//   const map = useMap();

//   useEffect(() => {
//     if (points.length > 0) {
//       // Create bounds for all points
//       const bounds = L.latLngBounds(points.map(point => [point.latitude, point.longitude]));
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [points, map]);

//   return null;
// }

// export default function PointsEditor({ points = [] }) {
//   const [markers, setMarkers] = useState(points);

//   // Update markers when points prop changes
//   useEffect(() => {
//     setMarkers(points);
//   }, [points]);

//   const handleMapClick = (event) => {
//     const { lat, lng } = event.latlng;
//     const newPoint = {
//       latitude: lat,
//       longitude: lng,
//       elevation: 0
//     };
//     setMarkers([...markers, newPoint]);
//   };

//   // Calculate initial center from points or use default
//   const initialCenter = points.length > 0 
//     ? [points[0].latitude, points[0].longitude]
//     : [28.6139, 77.2090];

//   return (
//     <div className="h-[500px] w-full relative">
//       <MapContainer
//         center={initialCenter}
//         zoom={13}
//         className="w-full h-full rounded-lg"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <MapEvents onMapClick={handleMapClick} />
//         <MapController points={markers} />
//         {markers.map((marker, index) => (
//           <Marker
//             key={index}
//             position={[marker.latitude, marker.longitude]}
//             icon={icon}
//           />
//         ))}
//       </MapContainer>

//       <div className="absolute top-4 right-4 text-black bg-white p-4 rounded-lg shadow z-[1000]">
//         <h3 className="font-bold mb-2">Points ({markers.length})</h3>
//         <div className="max-h-48 overflow-y-auto">
//           {markers.map((marker, index) => (
//             <div key={index} className="text-sm mb-2">
//               Point {index + 1}: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
//             </div>
//           ))}
//         </div>
        
//         {/* Export Button */}
//         <button
//           onClick={() => handleExport(markers)}
//           className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
//           disabled={markers.length === 0}
//         >
//           Export Points
//         </button>
//       </div>
//     </div>
//   );
// }

// // Add export function
// function handleExport(points) {
//   if (typeof window !== "undefined") {
//     // Create CSV content
//     const header = 'latitude,longitude,elevation';
//     const rows = points.map(point => 
//       `${point.latitude},${point.longitude},${point.elevation}`
//     );
//     const content = [header, ...rows].join('\n');

//     // Create and download file
//     const blob = new Blob([content], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'gcp_points.csv';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
//   }
// }
