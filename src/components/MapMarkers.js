/* eslint-disable require-jsdoc */
import {Marker} from 'react-leaflet';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

const MapMarkers = ({onChange, setOpen}) => {
  const {picArray} = useMedia(true, false);

  const handleChange = (item) => {
    onChange(item, true);
  };

  return picArray.map((item) => (
    <Marker
      key={item.file_id}
      position={[
        JSON.parse(item.description).lat,
        JSON.parse(item.description).lng,
      ]}
      eventHandlers={{
        click: () => {
          handleChange(item);
          setOpen(true);
        },
      }}
    />
  ));
};

MapMarkers.propTypes = {
  onChange: PropTypes.func,
  setOpen: PropTypes.func,
};

export default MapMarkers;
