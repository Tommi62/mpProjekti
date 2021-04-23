import {Button, Grid, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';

const StartInfo = ({user, onChange}) => {
  const handleChange = () => {
    console.log('HandleChange');
    onChange(true);
  };

  return (
    <>
      <Grid container justify="center">
        {user ? (
          <>
            <Grid container justify="center" style={{marginTop: '2rem'}}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                align="center"
              >
                Hello {user.username}!
              </Typography>
              <Typography
                component="h5"
                variant="h5"
                align="center"
                style={{margin: '1rem'}}
              >
                You can check out information of Hidden gem places other people
                have added by clicking the markers. If you want to add your own
                Hidden gem place click the button below.
              </Typography>
              <Button
                onClick={handleChange}
                color="primary"
                variant="contained"
                aria-label="Add a place"
                size="large"
                style={{marginTop: '5rem', height: '3.5rem'}}
              >
                Add a place
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid container justify="center" style={{marginTop: '2rem'}}>
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                align="center"
              >
                Hello stranger!
              </Typography>
              <Typography
                component="h5"
                variant="h5"
                align="center"
                style={{margin: '1rem'}}
              >
                You can check out information of Hidden gem places other people
                have added by clicking the markers. If you want to add your own
                Hidden gem place, please login.
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

StartInfo.propTypes = {
  user: PropTypes.object,
  onChange: PropTypes.func,
};

export default StartInfo;
