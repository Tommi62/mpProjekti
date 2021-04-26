/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {useComments} from '../hooks/ApiHooks';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import PostComments from './PostComments';


const CommentSection = ({data, user}) => {
  const {postComment, getComments} = useComments();
  const token = localStorage.getItem('token');
  let username = 'default';

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
      {user && (
        <>
          <form onSubmit={handleSubmit}>
            <TextField variant="outlined" margin="normal" fullWidth
              value={comment}
              onInput={(e) => setComment(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              post
            </Button>
          </form>
        </>
      )}
    </>
  );
};

CommentSection.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
};

export default CommentSection;
