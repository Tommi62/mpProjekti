/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {MapContainer, TileLayer, useMapEvents} from 'react-leaflet';
import Search from './Search';
import {OpenStreetMapProvider} from 'react-leaflet-geosearch';
import MapMarkers from './MapMarkers';
import PropTypes from 'prop-types';
import ChangeView from './ChangeView';
import {Marker} from 'react-leaflet';
import {useState} from 'react';

const Map = ({
  onChange,
  initialPosition,
  clicked,
  setClicked,
  setDropped,
  dropped,
  setHoverCoordinates,
  mapHover,
  visible,
  setVisible,
}) => {
  const [latLng, setLatLng] = useState('');

  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      mousemove(event) {
        onMapHover(event);
      },
      click() {
        dropMarker();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  };

  const onMapHover = (e) => {
    if (mapHover) {
      if (dropped) {
        setLatLng(e.latlng);
        setHoverCoordinates({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        setVisible(true);
      }
    }
  };

  const dropMarker = () => {
    if (mapHover) {
      setDropped(false);
    }
  };

  const prov = OpenStreetMapProvider();

  return (
    <>
      <MapContainer
        center={[60.171831, 24.9412]}
        zoom={15}
        scrollWheelZoom={true}
        style={{height: '100%', position: 'fixed', width: '75%'}}
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
        <LocationMarker />
        {visible && (
          <Marker
            draggable={'true'}
            eventHandlers={{
              dragend: (event) => {
                setHoverCoordinates({
                  lat: event.target.getLatLng().lat,
                  lng: event.target.getLatLng().lng,
                });
              },
              mousemove: (event) => {
                onMapHover(event);
              },
              click: () => {
                dropMarker();
              },
            }}
            key={'click'}
            position={latLng}
          />
        )}
      </MapContainer>
    </>
  );
};

Map.propTypes = {
  onChange: PropTypes.func,
  initialPosition: PropTypes.array,
  clicked: PropTypes.bool,
  setClicked: PropTypes.func,
  mapHover: PropTypes.bool,
  setHoverCoordinates: PropTypes.func,
  setDropped: PropTypes.func,
  dropped: PropTypes.bool,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
};

export default Map;
