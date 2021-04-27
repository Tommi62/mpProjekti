/* eslint-disable max-len */
import {Box, Card, CardHeader, CardMedia, Divider, Tabs, Typography} from '@material-ui/core';
/* eslint-disable comma-dangle */
/* eslint-disable indent */
import {Avatar} from '@material-ui/core';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import {useTag} from '../hooks/ApiHooks';
import LikeButton from './LikeButton';
import CloseButton from './CloseButton';
import CommentSection from './CommentSection';
import {makeStyles} from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
  },
  address: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
    marginRight: 'auto',
    padding: '9px'
  },
  addressIcon: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  addressBox: {
    display: 'flex',
    alignItems: 'center'
  },
  likeBtn: {
    marginLeft: 'auto'
  },
  desc: {
    padding: '16px',
    maxHeight: '100%',
    maxWidth: '100%',
    whiteSpace: 'pre-line',
  },
}));

const PlaceInfo = ({data, user, onChange}) => {
  const classes = useStyles();
  const [avatar, setAvatar] = useState('');
  const [myAvatar, setMyAvatar] = useState('');
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

  useEffect(() => {
    (async () => {
      try {
        const result = await getTag('avatar_' + user.user_id);
        if (result.length > 0) {
          const image = result.pop().filename;
          setMyAvatar(uploadsUrl + image);
        } else {
          setMyAvatar('');
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [data]);

  return (
    <>
      <Tabs
        orientation="vertical"
        variant="scrollable">
        <Card variant="scrollable">
          <CardHeader
            avatar={
              <Avatar
                variant={'round'}
                src={avatar}
                style={{marginRight: '0.5rem'}}
              />
            }
            action={
              <CloseButton onChange={onChange} />
            }
            title={data.title}
            subheader={data.username}
          />
          <CardMedia
            className={classes.media}
            image={uploadsUrl + data.file}
          />
          <Box className={classes.addressBox}>
            <Box className={classes.address}>
              <LocationOnIcon color="disabled" />
              <Typography variant="body2" color="textSecondary" component="p">
                {data.address}, {data.city}
              </Typography>
            </Box>
            <LikeButton data={data} user={user} />
          </Box>
          <Divider />
          <Box>
            <Typography variant="body1" color="textPrimary" component="p" className={classes.desc}>
              {data.description}
            </Typography>
          </Box>
          <Divider />
          <CommentSection data={data} user={user} avatar={myAvatar} />
        </Card>
      </Tabs>
    </>
  );
};

PlaceInfo.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  onChange: PropTypes.func,
};

export default PlaceInfo;
