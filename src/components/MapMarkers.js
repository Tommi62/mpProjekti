import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SingleMarker from './SingleMarker';

const MapMarkers = ({onChange, setOpen}) => {
  const {picArray} = useMedia(true, false);

  return picArray.map((item) => (
    <SingleMarker
      key={item.file_id}
      onChange={onChange}
      item={item}
      setOpen={setOpen}
    />
  ));
};

MapMarkers.propTypes = {
  onChange: PropTypes.func,
  setOpen: PropTypes.func,
};

export default MapMarkers;
