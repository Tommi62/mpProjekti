import {IconButton} from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import PropTypes from 'prop-types';

const CloseButton = ({onChange, whiteIcon}) => {
  const handleChange = () => {
    onChange(false);
  };

  return (
    <>
      {whiteIcon ? (
        <IconButton onClick={handleChange}>
          <CancelOutlinedIcon style={{color: '#ffffff'}} />
        </IconButton>
      ) : (
        <IconButton onClick={handleChange}>
          <CancelOutlinedIcon />
        </IconButton>
      )}
    </>
  );
};

CloseButton.propTypes = {
  onChange: PropTypes.func,
  whiteIcon: PropTypes.bool,
};

export default CloseButton;
