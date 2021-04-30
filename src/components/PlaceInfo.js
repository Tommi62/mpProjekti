/* eslint-disable max-len */
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  Divider,
  Typography,
} from '@material-ui/core';
/* eslint-disable comma-dangle */
/* eslint-disable indent */
import {Avatar} from '@material-ui/core';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import {useLikes, useTag} from '../hooks/ApiHooks';
import LikeButton from './LikeButton';
import CloseButton from './CloseButton';
import CommentSection from './CommentSection';
import {makeStyles} from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import logo from '../gem-logo.svg';

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
    marginRight: '0.5rem',
  },
  address: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
    marginRight: 'auto',
    padding: '9px',
  },
  addressIcon: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  addressBox: {
    display: 'flex',
    alignItems: 'center',
  },
  likeBtn: {
    marginLeft: 'auto',
  },
  desc: {
    padding: '16px',
    maxHeight: '100%',
    maxWidth: '100%',
    whiteSpace: 'pre-line',
  },
  gemDesc: {
    padding: '16px',
    maxHeight: '100%',
    maxWidth: '100%',
    whiteSpace: 'pre-line',
    border: '1px solid',
    borderImageSlice: 1,
    borderImageSource: 'linear-gradient(to left, #ffffff, #00897b)',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  card: {
    overflowY: 'auto',
  },
}));

const PlaceInfo = ({data, user, onChange}) => {
  const classes = useStyles();
  const [avatar, setAvatar] = useState('');
  const [myAvatar, setMyAvatar] = useState('');
  const [changed, setChanged] = useState(0);
  const [gem, setGem] = useState(false);
  const [multiplier, setMultiplier] = useState('');
  const {getTag} = useTag();
  const {getLikes} = useLikes();

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

  useEffect(() => {
    (async () => {
      try {
        let likeCount = 0;
        const postLikes = await getLikes(data.file_id);
        postLikes.map((likeObject) => {
          likeCount++;
        });
        if (likeCount >= 2) {
          setGem(true);
          if (likeCount / 2 >= 2) {
            setMultiplier(Math.floor(likeCount / 2) + 'x');
          } else {
            setMultiplier('');
          }
        } else {
          setGem(false);
          setMultiplier('');
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [changed, data]);

  return (
    <>
      <Card className={classes.card}>
        {gem ? (
          <CardHeader
            avatar={<Avatar variant={'circular'} src={avatar} />}
            action={<CloseButton onChange={onChange} whiteIcon={true} />}
            title={data.title}
            subheader={data.username}
            classes={{
              title: classes.headerTitle,
            }}
            style={{
              background: 'linear-gradient(45deg, #ffffff 30%, #26a69a 90%)',
            }}
          />
        ) : (
          <CardHeader
            avatar={<Avatar variant={'circular'} src={avatar} />}
            action={<CloseButton onChange={onChange} whiteIcon={false} />}
            title={data.title}
            subheader={data.username}
            classes={{
              title: classes.headerTitle,
            }}
          />
        )}
        <CardMedia className={classes.media} image={uploadsUrl + data.file} />
        <Box className={classes.addressBox}>
          {gem ? (
            <Box className={classes.address}>
              <LocationOnIcon style={{color: '#00897b'}} />
              <Typography variant="body2" color="primary" component="p">
                {data.address}, {data.city}
              </Typography>
            </Box>
          ) : (
            <Box className={classes.address}>
              <LocationOnIcon color="disabled" />
              <Typography variant="body2" color="textSecondary" component="p">
                {data.address}, {data.city}
              </Typography>
            </Box>
          )}
          <Typography
            variant="h5"
            style={{color: '#297373', fontWeight: 'bold'}}
          >
            {multiplier}
          </Typography>
          {gem && (
            <img
              src={logo}
              alt="hidden gem"
              style={{
                height: '3rem',
                width: '3rem',
              }}
            />
          )}
          <LikeButton
            data={data}
            user={user}
            setChanged={setChanged}
            changed={changed}
          />
        </Box>
        <Divider />
        {gem ? (
          <Box>
            <Typography
              variant="body1"
              color="textPrimary"
              component="p"
              className={classes.gemDesc}
            >
              {data.description}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="body1"
              color="textPrimary"
              component="p"
              className={classes.desc}
            >
              {data.description}
            </Typography>
          </Box>
        )}
        <Divider />
        <CommentSection data={data} user={user} avatar={myAvatar} />
      </Card>
    </>
  );
};

PlaceInfo.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  onChange: PropTypes.func,
};

export default PlaceInfo;
