import './App.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import Mapcontainer from './components/MapContainer';

function App() {
  return (
    <div>
      <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css' rel='stylesheet' />
      <Mapcontainer />
    </div>
  );
}

export default App;
