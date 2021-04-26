/* eslint-disable indent */
import {List} from '@material-ui/core';
import {PropTypes} from 'prop-types';
import Comment from './Comment';

const PostComments = ({comments}) => {
  return (
    <List>
      {comments.map((item) => (
        <Comment key={item.comment_id} comment={item}></Comment>
      ))}
    </List>
  );
};


PostComments.propTypes = {
  comments: PropTypes.array,
};

export default PostComments;
