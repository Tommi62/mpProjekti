/* eslint-disable max-len */
import {Grid, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import LikeButton from './LikeButton';

const PlaceInfo = ({data, user}) => {
  let desc = {};
  try {
    desc = JSON.parse(data.description);
    console.log(desc);
  } catch (e) {
    desc = {description: data.description};
  }

  console.log('Description', desc.description.description);
  return (
    <>
      <Grid container direction="column" justify="center">
        <Grid item>
          <Typography component="h1" variant="h2" gutterBottom align="center">
            {data.title}
          </Typography>
        </Grid>

        <img
          src={uploadsUrl + data.file}
          alt={data.title}
          style={{
            width: '25rem',
            margin: 'auto',
          }}
        />
        <LikeButton data={data} user={user} />

        <Grid item>
          <Typography gutterBottom align="center">
            {desc.description.address} {desc.description.city}
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom align="center">
            {desc.description.description}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

PlaceInfo.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
};

export default PlaceInfo;
