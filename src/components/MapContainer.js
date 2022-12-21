import * as React from 'react';
import { useState, useMemo } from 'react';
import Map, {
  Marker,
  Layer, Source
} from 'react-map-gl';
import Pin from './pin';
import { Line } from './line';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function Mapcontainer() {
  const [CITIES, setCities] = useState([]);
  const [currentLng, setLng] = useState("");
  const [currentLntd, setLtd] = useState("");
  const [previousLon, setPreviousLon] = useState([]);
  const [coordinates, setCoordinates] = useState({ cors: [], dist: [] });


  const pins = useMemo(
    () =>
      CITIES.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setCities([...CITIES, city])
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );
  const handleClear = () => {
    setCoordinates({ cors: [], dist: [] })
    setCities([])
    setLng("");
    setLtd("")
  }
  const dataOne = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiLineString",
      coordinates: coordinates.cors.length > 1 ? coordinates.cors : null
    }
  };

  return (
    <div>
      <div className='wrapper'>
        <Map
          initialViewState={{
            longitude: 77.4126,
            latitude: 23.2599,
            center: [-111.75, 40.581],
            zoom: 12,
            pitch: 60,
          }}
          style={{ width: 1000, height: 600 }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onClick={(e) => {
            setLng(e.lngLat.lng)
            setLtd(e.lngLat.lat)
            setCities([...CITIES, { lat: e.lngLat.lat, lon: e.lngLat.lng }])
            if (currentLng === "" && currentLntd === "") {
              setCoordinates({
                ...coordinates,
                cors: [...(coordinates.cors), [[e.lngLat.lng, e.lngLat.lat], [e.lngLat.lng, e.lngLat.lat]]],
                dist: [...(coordinates.dist), getDistanceFromLatLonInKm(e.lngLat.lat, e.lngLat.lng, e.lngLat.lat, e.lngLat.lng)]
              })
            } else {
              setPreviousLon([...previousLon, getDistanceFromLatLonInKm(currentLntd, currentLng, e.lngLat.lat, e.lngLat.lng)])
              setCoordinates({
                ...coordinates,
                cors: [...(coordinates.cors), [[currentLng, currentLntd], [e.lngLat.lng, e.lngLat.lat]]],
                dist: [...(coordinates.dist), getDistanceFromLatLonInKm(currentLntd, currentLng, e.lngLat.lat, e.lngLat.lng)]
              })
            }
          }}
          mapboxAccessToken="pk.eyJ1Ijoia2FzaGlhcm9yYTI5IiwiYSI6ImNsYmRkdXRlODAwZ2IzcW53dWpqMDF3ZmQifQ.JWpw5ikiFc1lWf-YHTIw8Q"
        >
          {pins}
          {
            CITIES.map((city) => {
              return <Marker key={city.lat} latitude={city.lat} longitude={city.lon}></Marker>
            })
          }
          {
            coordinates.cors && coordinates.cors.length > 1 ? coordinates.cors.map((a, i) => {
              return (
                <div key={Math.random().toString() + Math.random()}>
                  <Source id="polylineLayer" type="geojson" data={dataOne}>
                    <Layer
                      id={"lineLayer" + Math.random() + i}
                      type="line"
                      source="my-data"
                      layout={{
                        "line-join": "round",
                        "line-cap": "round",
                      }}
                      paint={{
                        "line-color": "rgba(3, 170, 238, 0.5)",
                        "line-width": 5,
                      }}
                    />
                  </Source>
                </div>
              )
            }) : null
          }
          {
            coordinates.cors.map((a, i) => {
              let kms = coordinates.dist[coordinates.dist.length - 1]
              const dataOne1 = {
                type: "Feature",
                "properties": {
                  "title": "Mapbox DC",
                  "marker-symbol": "monument"
                },
                geometry: {
                  type: "Point",
                  coordinates: coordinates.cors.length > 0 && coordinates.cors[coordinates.cors.length - 1][1] ? coordinates.cors[coordinates.cors.length - 1][1] : null
                }
              };
              return <Line key={Math.random()} prev={previousLon} x={kms} data={dataOne1} />;
            })
          }
        </Map>
        <button className='clrBtn' onClick={handleClear}>Clear</button>
      </div>
      <marquee scrollamount="15" style={{ color: 'black' }}><h1>React application to measure distance between two points on map using react-map-gl library by Kashinath Arora</h1></marquee>
    </div>

  );
}

export default Mapcontainer;