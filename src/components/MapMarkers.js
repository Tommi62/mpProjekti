/* eslint-disable require-jsdoc */
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SingleMarker from './SingleMarker';

const MapMarkers = ({onChange}) => {
  const {picArray} = useMedia(true, false);

  return picArray.map((item) => (
    <SingleMarker key={item.file_id} onChange={onChange} item={item} />
  ));
};

MapMarkers.propTypes = {
  onChange: PropTypes.func,
};

export default MapMarkers;
