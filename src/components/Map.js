/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
import {MapContainer, TileLayer} from 'react-leaflet';
import Search from './Search';
import {OpenStreetMapProvider} from 'react-leaflet-geosearch';
import MapMarkers from './MapMarkers';
import PropTypes from 'prop-types';
import ChangeView from './ChangeView';

<<<<<<< HEAD
const Map = ({onChange, initialPosition, clicked, setClicked}) => {
=======

const Map = (props) => {
  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const redIcon = new LeafIcon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
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

    return position === null ? null : (
      <Marker position={position} icon={redIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  const [latLng, setLatLng] = useState('');
  const [visible, setVisible] = useState(false);


  function onMapHover(e) {
    if (props.mapHover) {
      if (props.dropped) {
        setLatLng(e.latlng);
        props.setHoverCoordinates({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        setVisible(true);
      }
    }
  };

  const dropMarker = () => {
    if (props.mapHover) {
      props.setDropped(false);
    }
  };

>>>>>>> andrei6
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
        <MapMarkers onChange={props.onChange} />
        {visible && (
          <Marker
            draggable={'true'}
            eventHandlers={{
              dragend: (event) => {
                props.setHoverCoordinates({
                  lat: event.target.getLatLng().lat,
                  lng: event.target.getLatLng().lng,
                });
              },
            }}
            key={'click'}
            position={
              latLng
            }
          />
        )}
      </MapContainer>
    </>
  );
};

Map.propTypes = {
  onChange: PropTypes.func,
<<<<<<< HEAD
  initialPosition: PropTypes.array,
  clicked: PropTypes.bool,
  setClicked: PropTypes.func,
=======
  mapHover: PropTypes.bool,
  setHoverCoordinates: PropTypes.func,
  setDropped: PropTypes.func,
  dropped: PropTypes.bool,
>>>>>>> andrei6
};

export default Map;
