/* eslint-disable new-cap */

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import Search from './Search';
import {OpenStreetMapProvider} from 'react-leaflet-geosearch';
import MapMarkers from './MapMarkers';
import PropTypes from 'prop-types';
import ChangeView from './ChangeView';
import {Marker} from 'react-leaflet';
import {useState} from 'react';
import LocationButton from './LocationButton';
import * as L from 'leaflet';
import gemMarker from '../gem-marker.png';

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
  setOpen,
  setInitialPosition,
}) => {
  const [latLng, setLatLng] = useState('');

  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const greyIcon = new LeafIcon({
    iconUrl: gemMarker,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 42],
    iconAnchor: [15, 44],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

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
        style={{height: '100%', width: '100%', position: 'fixed'}}
        zoomControl={false}
        attributionControl={false}
      >
        <ChangeView
          center={initialPosition}
          zoom={17}
          clicked={clicked}
          onChange={setClicked}
        />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.mapbox.com/styles/v1/andreih/cko9xwqp24wd318los2ojo651/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYW5kcmVpaCIsImEiOiJja2h2czJrdTUwaTNyMzRtb3JrZjVvYnpmIn0.QGfO5Fq0XigYlW9b89K4aA"
          zIndex={-1}
        />
        <ZoomControl position="topright" />
        <Search
          position="topright"
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
        <MapMarkers onChange={onChange} setOpen={setOpen} />
        <LocationButton
          setInitialPosition={setInitialPosition}
          setClicked={setClicked}
        />
        <LocationMarker />
        {visible && (
          <Marker
            draggable={'true'}
            icon={greyIcon}
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
  setOpen: PropTypes.func,
  setInitialPosition: PropTypes.func,
};

export default Map;
