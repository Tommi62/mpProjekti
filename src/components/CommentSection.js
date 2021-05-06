import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {useComments} from '../hooks/ApiHooks';
import {Avatar, useMediaQuery} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import PostComments from './PostComments';
import {makeStyles} from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import {IconButton} from '@material-ui/core';
import {useTheme} from '@material-ui/core/styles';

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
    height: theme.spacing(5),
    width: theme.spacing(5),
  },
}));

const CommentSection = ({data, user, avatar}) => {
  const classes = useStyles();
  const {postComment, getComments} = useComments();
  const token = localStorage.getItem('token');
  let username = 'default';
  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.up('sm'));

  if (user) {
    username = user.username;
  }

  let id = null;
  try {
    id = data.file_id;
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
    await postComment(token, id, commentObject);
    parseComments(id);
    setComment('');
  };

  useEffect(() => {
    if (!(data.file_id === '')) {
      parseComments(id);
    }
  }, [data]);

  return (
    <>
      <div style={{position: 'relative'}}>
        <PostComments comments={comments} />
        {user && (
          <>
            {breakpoint ? (
              <form
                onSubmit={handleSubmit}
                className={classes.form}
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  width: '400px',
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >
                <div className={classes.margin}>
                  <Avatar
                    alt={user.username}
                    src={avatar}
                    className={classes.small}
                  />
                  <TextField
                    id="input-with-icon-grid"
                    value={comment}
                    className={classes.commentInput}
                    onInput={(e) => setComment(e.target.value)}
                  />
                  <IconButton
                    aria-label="delete"
                    type="submit"
                    variant="contained"
                    color="disabled"
                    className={classes.commentButton}
                  >
                    <SendIcon />
                  </IconButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.margin}>
                  <Avatar
                    alt={user.username}
                    src={avatar}
                    className={classes.small}
                  />
                  <TextField
                    id="input-with-icon-grid"
                    value={comment}
                    className={classes.commentInput}
                    onInput={(e) => setComment(e.target.value)}
                  />
                  <IconButton
                    aria-label="delete"
                    type="submit"
                    variant="contained"
                    color="disabled"
                    className={classes.commentButton}
                  >
                    <SendIcon />
                  </IconButton>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
};

CommentSection.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
  avatar: PropTypes.object,
};

export default CommentSection;
