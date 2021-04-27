/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {useComments} from '../hooks/ApiHooks';
import {Avatar, Button, Divider} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import PostComments from './PostComments';
import {makeStyles} from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    margin: '0px 0px 0px 4px',
  },
  margin: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  commentInput: {
    padding: '0px 9px 0px 9px',
    width: '100%',
  },
  commentButton: {
    height: theme.spacing(4),
  },
}));

const CommentSection = ({data, user, avatar}) => {
  const classes = useStyles();
  const {postComment, getComments} = useComments();
  const token = localStorage.getItem('token');
  let username = 'default';
  console.log('avatar ' + avatar);

  if (user) {
    username = user.username;
  };

  let id = null;
  try {
    id = data.file_id;
    console.log('file_id: ' + id);
  } catch (e) {
    console.log('file_id error: ' + id);
  }

  const [comments, setComments] = useState([
    {
      comment: '',
      user_id: 392,
    },
  ]);

  const parseComments = async (id) => {
    const postComments = await getComments(id);
    setComments(postComments);
  };

  const [comment, setComment] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const commentObject = JSON.stringify({
      comment: comment,
      username: username,
    });
    console.log('commenting post ' + commentObject);
    await postComment(token, id, commentObject);
    parseComments(id);
    setComment('');
  };

  useEffect(() => {
    console.log('comments useeffect');
    if (!(data.file_id === '')) {
      parseComments(id);
    }
  }, [data]);

  return (
    <>
      <PostComments comments={comments} />
      <Divider />
      {user && (
        <>
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.margin}>
              <Avatar alt={user.username} src={avatar} className={classes.small} />
              <TextField id="input-with-icon-grid" value={comment} className={classes.commentInput} onInput={(e) => setComment(e.target.value)} />

              <Button type="submit" variant="contained" color="disabled" className={classes.commentButton}>
                <SendIcon />
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
};

CommentSection.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  avatar: PropTypes.object,
};

export default CommentSection;
