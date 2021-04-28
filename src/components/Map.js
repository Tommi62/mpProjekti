/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {MapContainer, TileLayer} from 'react-leaflet';
import Search from './Search';
import {OpenStreetMapProvider} from 'react-leaflet-geosearch';
import MapMarkers from './MapMarkers';
import PropTypes from 'prop-types';
import ChangeView from './ChangeView';

const Map = ({onChange, initialPosition, clicked, setClicked}) => {
  const prov = OpenStreetMapProvider();

  return (
    <>
      <MapContainer
        center={[60.171831, 24.9412]}
        zoom={15}
        scrollWheelZoom={true}
        style={{height: '100%'}}
      >
        <ChangeView
          center={initialPosition}
          zoom={17}
          clicked={clicked}
          onChange={setClicked}
        />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          zIndex={-1}
        />
        <Search
          provider={prov}
          showMarker={false}
          showPopup={false}
          popupFormat={({query, result}) => result.label}
          maxMarkers={3}
          retainZoomLevel={false}
          animateZoom={true}
          autoClose={true}
          searchLabel={'Enter address, please'}
          keepResult={false}
        />

        <MapMarkers onChange={onChange} />
      </MapContainer>
    </>
  );
};

Map.propTypes = {
  onChange: PropTypes.func,
  initialPosition: PropTypes.array,
  clicked: PropTypes.bool,
  setClicked: PropTypes.func,
};

export default Map;
