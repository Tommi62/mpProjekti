/* eslint-disable max-len */
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {uploadsUrl} from '../utils/variables';
import {PropTypes} from 'prop-types';
import {Modal} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import {IconButton} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import {Link as RouterLink} from 'react-router-dom';
import {useMedia} from '../hooks/ApiHooks';
import {withRouter} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    maxWidth: 345,
    zIndex: 10,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  media: {
    height: 140,
  },
  address: {
    textTransform: 'capitalize',
    marginBottom: '10px',
  },
});

const ProfileModal = ({post, history}) => {
  const {deleteMedia} = useMedia(true, post);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={uploadsUrl + post.thumbnails?.w320}
                title={post.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  component="p"
                  className={classes.address}
                >
                  {JSON.parse(post.description).address +
                    ', ' +
                    JSON.parse(post.description).city +
                    '.'}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {JSON.parse(post.description).description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <IconButton
                aria-label={`modify file`}
                className={classes.icon}
                component={RouterLink}
              >
                <CreateIcon fontSize="large" />
              </IconButton>
              <IconButton
                aria-label={`delete file`}
                className={classes.icon}
                onClick={() => {
                  try {
                    // eslint-disable-next-line no-restricted-globals
                    const conf = confirm('Do you really want to delete?');
                    if (conf) {
                      deleteMedia(post.file_id, localStorage.getItem('token'));
                      // history.push('/profile'); ???
                    }
                  } catch (e) {
                    console.log(e.message);
                  }
                }}
              >
                <DeleteIcon fontSize="large" />
              </IconButton>
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
};

export default withRouter(ProfileModal);
