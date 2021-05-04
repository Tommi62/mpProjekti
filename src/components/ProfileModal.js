/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {uploadsUrl} from '../utils/variables';
import {PropTypes} from 'prop-types';
import {Box, CardHeader, Divider, Grid, Modal} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {useComments, useMedia} from '../hooks/ApiHooks';
import {withRouter} from 'react-router-dom';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PostComments from './PostComments';
import logo from '../post-gem-logo.svg';
import logoDisabled from '../post-gem-logo-disabled.svg';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '20rem',
    height: '30rem',
    zIndex: 10,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'auto',
  },
  media: {
    height: 140,
  },
  headerTitle: {
    textAlign: 'center',
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
  desc: {
    border: '1px solid',
  },
});

const ProfileModal = ({post, history, gem, multiplier, likes}) => {
  const {deleteMedia} = useMedia(true, post);
  const {getComments} = useComments();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [comments, setComments] = useState([
    {
      comment: '',
      user_id: 392,
    },
  ]);

  let id = null;
  try {
    id = post.file_id;
  } catch (e) {
    console.log('file_id error: ' + id);
  }

  const parseComments = async (id) => {
    const postComments = await getComments(id);
    setComments(postComments);
  };

  useEffect(() => {
    if (!(post.file_id === '')) {
      parseComments(id);
    }
  }, [post]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton
        aria-label={`show post`}
        className={classes.icon}
        onClick={handleOpen}
      >
        <InfoIcon fontSize="large" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <Card className={classes.root}>
            {gem ? (
              <CardHeader
                title={post.title}
                classes={{
                  title: classes.headerTitle,
                }}
                style={{
                  background:
                    'linear-gradient(45deg, #ffffff 30%, #26a69a 90%)',
                }}
              />
            ) : (
              <CardHeader
                title={post.title}
                classes={{
                  title: classes.headerTitle,
                }}
              />
            )}
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={uploadsUrl + post.thumbnails?.w320}
                title={post.title}
              />
              <Box className={classes.addressBox}>
                {gem ? (
                  <Box className={classes.address}>
                    <LocationOnIcon style={{color: '#00897b'}} />
                    <Typography variant="body2" color="primary" component="p">
                      {JSON.parse(post.description).address +
                        ', ' +
                        JSON.parse(post.description).city}
                    </Typography>
                  </Box>
                ) : (
                  <Box className={classes.address}>
                    <LocationOnIcon color="disabled" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {JSON.parse(post.description).address +
                        ', ' +
                        JSON.parse(post.description).city}
                    </Typography>
                  </Box>
                )}
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: '0.5rem',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" style={{color: '#297373'}}>
                    {multiplier}
                  </Typography>
                  {gem ? (
                    <img
                      src={logo}
                      alt="hidden gem"
                      style={{
                        height: '1.5rem',
                        width: '1.5rem',
                        marginLeft: '-2px',
                      }}
                    />
                  ) : (
                    <img
                      src={logoDisabled}
                      alt="hidden gem"
                      style={{
                        height: '1.5rem',
                        width: '1.5rem',
                      }}
                    />
                  )}
                  <FavoriteIcon
                    color="secondary"
                    style={{
                      height: '1.5rem',
                      width: '1.5rem',
                    }}
                  />
                  <Typography variant="h6" style={{color: '#297373'}}>
                    {likes}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <CardContent>
                <Box>
                  <Typography variant="body1" color="textPrimary" component="p">
                    {JSON.parse(post.description).description}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <PostComments comments={comments} />
              <Divider />
            </CardActionArea>
            <CardActions>
              <Grid container justify="flex-end">
                <IconButton
                  aria-label={`delete file`}
                  className={classes.icon}
                  onClick={() => {
                    try {
                      // eslint-disable-next-line no-restricted-globals
                      const conf = confirm('Do you really want to delete?');
                      if (conf) {
                        deleteMedia(
                          post.file_id,
                          localStorage.getItem('token')
                        );
                        history.push('/');
                      }
                    } catch (e) {
                      console.log(e.message);
                    }
                  }}
                >
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </Grid>
            </CardActions>
          </Card>
        }
      </Modal>
    </>
  );
};

ProfileModal.propTypes = {
  post: PropTypes.object,
  history: PropTypes.object,
  gem: PropTypes.bool,
  multiplier: PropTypes.string,
  likes: PropTypes.number,
};

export default withRouter(ProfileModal);
