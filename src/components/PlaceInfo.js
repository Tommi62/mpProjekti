/* eslint-disable comma-dangle */
/* eslint-disable indent */
import {Avatar, Grid, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import {useTag} from '../hooks/ApiHooks';

const PlaceInfo = ({data}) => {
  const [avatar, setAvatar] = useState('');
  const {getTag} = useTag();

  useEffect(() => {
    (async () => {
      try {
        const result = await getTag('avatar_' + data.user_id);
        if (result.length > 0) {
          const image = result.pop().filename;
          setAvatar(uploadsUrl + image);
        } else {
          setAvatar('');
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [data]);

  return (
    <>
      <Grid container alignItems="center" style={{margin: '1rem'}}>
        <Avatar
          variant={'round'}
          src={avatar}
          style={{marginRight: '0.5rem'}}
        />
        <Typography variant="subtitle2">{data.username}</Typography>
      </Grid>
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

        <Grid item>
          <Typography gutterBottom align="center">
            {data.address} {data.city}
          </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom align="center">
            {data.description}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

PlaceInfo.propTypes = {
  data: PropTypes.object,
};

export default PlaceInfo;
