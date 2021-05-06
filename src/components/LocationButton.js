/* eslint-disable quote-props */
import {Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import {grey} from '@material-ui/core/colors';
import {withStyles} from '@material-ui/core/styles';

const CustomButton = withStyles((theme) => ({
  root: {
    position: 'absolute',
    zIndex: '801',
    top: '127px',
    right: '10px',
    width: '20px',
    minWidth: '33px',
    minHeight: '32px',
    padding: '3px',
    border: '2px solid ' + grey[500],
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[100],
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
}))(Button);

const LocationButton = ({setInitialPosition, setClicked}) => {
  const buttonClicked = () => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        setInitialPosition([latitude, longitude]);
        setClicked(true);
      });
    } catch (error) {
      alert('We did not find you.');
    }
  };

  return (
    <CustomButton
      position="topright"
      onClick={buttonClicked}
      type="button"
      variant="contained"
    >
      <MyLocationIcon style={{opacity: '0.6'}}></MyLocationIcon>
    </CustomButton>
  );
};

LocationButton.propTypes = {
  setInitialPosition: PropTypes.func,
  setClicked: PropTypes.func,
};

export default LocationButton;
