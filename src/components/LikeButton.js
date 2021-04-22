/* eslint-disable max-len */
import {Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {useLikes} from '../hooks/ApiHooks';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';


const LikeButton = ({data, user}) => {
  let liked = 0;
  const {postLike, getLikes, deleteLike} = useLikes();
  const token = localStorage.getItem('token');
  const [likedByUser, setLikedByUser] = useState(0);

  let id = null;
  try {
    id = data.file_id;
    console.log('file_id: ' + id);
  } catch (e) {
    console.log('file_id error: ' + id);
  }

  const [likes, setLikes] = useState(0);

  const parseLikes = async (id) => {
    let likeCount = 0;
    const postLikes = await getLikes(id);
    postLikes.map((likeObject) => {
      likeCount++;
      if (likeObject.user_id === user.user_id) {
        console.log('like if object userid: ' + likeObject.user_id + ' user userid:' + user.user_id);
        liked = 1;
      }
    });
    console.log('postLikes: ' + postLikes.length);
    setLikedByUser(liked);
    setLikes(likeCount);
  };

  const toggleLike = async () => {
    if (!likedByUser) {
      console.log('liking post');
      await postLike(token, id);
      parseLikes(id);
    } else {
      console.log('unliking post');
      await deleteLike(token, id);
      parseLikes(id);
    }
  };

  useEffect(() => {
    console.log('likes useeffect');
    if (!(data.file_id === '')) {
      parseLikes(id);
    }
  }, [data]);

  return (
    <>
      <Typography component="h1" variant="h2" gutterBottom>
        like count {likes}
      </Typography>
      {likedByUser ? (
        <IconButton onClick={toggleLike} color="secondary" aria-label="like">
          <FavoriteIcon />
        </IconButton>
      ) : (
        <IconButton onClick={toggleLike} aria-label="like">
          <FavoriteIcon />
        </IconButton>
      )}
    </>
  );
};

LikeButton.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
};

export default LikeButton;
