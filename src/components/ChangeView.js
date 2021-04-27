import {Marker, Popup, useMap} from 'react-leaflet';
import PropTypes from 'prop-types';
import * as L from 'leaflet';

const ChangeView = ({center, zoom, clicked, onChange}) => {
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

  const handleChange = () => {
    onChange(false);
  };

  if (clicked) {
    const map = useMap();
    map.setView(center, zoom);
    handleChange();
  }
  if (center !== null) {
    return (
      <Marker key={19567} position={center} icon={redIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  } else {
    return null;
  }
};

ChangeView.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  clicked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default ChangeView;
