/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {useState} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import Search from './Search';
import {OpenStreetMapProvider} from 'react-leaflet-geosearch';
import MapMarkers from './MapMarkers';
import PropTypes from 'prop-types';
import {Button} from '@material-ui/core';
import ChangeView from './ChangeView';

const Map = ({onChange}) => {
  const [initialPosition, setInitialPosition] = useState(null);
  const [clicked, setClicked] = useState(false);

  const prov = OpenStreetMapProvider();

  const buttonClicked = () => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        setInitialPosition([latitude, longitude]);
        setClicked(true);
      });
    } catch (error) {
      console.log(error.message);
      alert('We did not find you.');
    }
  };

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
        <Button
          onClick={buttonClicked}
          type="button"
          color="primary"
          variant="contained"
          fullWidth
        >
          Lähetä
        </Button>
        <MapMarkers onChange={onChange} />
      </MapContainer>
    </>
  );
};

Map.propTypes = {
  onChange: PropTypes.func,
};

export default Map;
