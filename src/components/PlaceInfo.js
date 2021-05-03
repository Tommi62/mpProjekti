/* eslint-disable max-len */
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  Divider,
  Modal,
  Typography,
  useMediaQuery,
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
import logo from '../post-gem-logo.svg';
import logoDisabled from '../post-gem-logo-disabled.svg';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import {IconButton} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  modalMedia: {
    height: '50%',
    width: '50%',
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
  const [open, setOpen] = useState(false);
  const {getTag} = useTag();
  const {getLikes} = useLikes();
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.up('sm'));

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
            setMultiplier(Math.floor(likeCount / 2));
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Card className={classes.card} style={breakpoint ? ({marginBottom: '64px'}) : ({marginBottom: '0px'})}>
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
        <div
          style={{
            position: 'relative',
          }}>
          <IconButton
            aria-label={`show post`}
            className={classes.icon}
            onClick={handleOpen}
            style={{
              position: 'absolute',
              right: 3,
              top: -49,
            }}
          >
            <FullscreenIcon fontSize="medium" />
          </IconButton>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {
            <Card className={classes.root}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: 'auto',
                width: '50%',
                maxWidth: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
              <CardMedia
                className={classes.media}
                image={uploadsUrl + data.file}
              />
            </Card>
          }
        </Modal>
        <Box className={classes.addressBox}>
          <Box className={classes.address}>
            <LocationOnIcon color="disabled" />
            <Typography variant="body2" color="textSecondary" component="p">
              {data.address}, {data.city}
            </Typography>
          </Box>
          <Typography
            variant="h5"
            style={{color: '#297373'}}
          >
            {multiplier}
          </Typography>
          {gem ? (
            <img
              src={logo}
              alt="hidden gem"
              style={{
                height: '1.8rem',
                width: '1.8rem',
                marginLeft: '-2px',
              }}
            />
          ) : (
            <img
              src={logoDisabled}
              alt="hidden gem"
              style={{
                height: '1.8rem',
                width: '1.8rem'
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
