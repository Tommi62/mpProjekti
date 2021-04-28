import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';

const LocationButton = ({setInitialPosition, setClicked}) => {
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
    <Button
      onClick={buttonClicked}
      type="button"
      color="primary"
      variant="contained"
    >
      Get current position
    </Button>
  );
};

LocationButton.propTypes = {
  setInitialPosition: PropTypes.func,
  setClicked: PropTypes.func,
};

export default LocationButton;
