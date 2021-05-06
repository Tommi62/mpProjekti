/* eslint-disable indent */
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import {PropTypes} from 'prop-types';
import {useEffect} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {useState} from 'react';
import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const Comment = ({comment}) => {
  const classes = useStyles();
  const {getTag} = useTag();
  const [img, setImg] = useState('');

  let commentObject = {};
  try {
    commentObject = JSON.parse(comment.comment);
  } catch (e) {
    commentObject = {
      username: 'default',
      comment: comment.comment,
    };
  }

  useEffect(() => {
    (async () => {
      try {
        const result = await getTag('avatar_' + comment.user_id);
        if (result.length > 0) {
          const image = result.pop().filename;
          setImg(uploadsUrl + image);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={commentObject.username} src={img} />
        </ListItemAvatar>
        <ListItemText
          primary={commentObject.username}
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {commentObject.comment}
              </Typography>
            </>
          }
        />
      </ListItem>
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
};

export default Comment;
