import {IconButton} from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PropTypes from 'prop-types';

const CloseButton = ({onChange}) => {
  const handleChange = () => {
    console.log('Clicked');
    onChange(false);
  };

  return (
    <IconButton onClick={handleChange}>
      <CancelOutlinedIcon />
    </IconButton>
  );
};

CloseButton.propTypes = {
  onChange: PropTypes.func,
};

export default CloseButton;
