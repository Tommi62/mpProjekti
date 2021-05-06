import {List, ListItem} from '@material-ui/core';
import {PropTypes} from 'prop-types';
import Comment from './Comment';
import {makeStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  '@global': {
    'ul:empty': {
      display: 'none',
    },
  },
}));

const PostComments = ({comments}) => {
  const classes = useStyles();
  return (
    <List className={classes.list}>
      {comments.map((item) => (
        <Comment key={item.comment_id} comment={item}></Comment>
      ))}{' '}
      {comments == '' && (
        <ListItem alignItems="flex-start" color="textSecondary">
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            style={{margin: '0 0 3rem 0'}}
          >
            no comments...
          </Typography>
        </ListItem>
      )}
    </List>
  );
};

PostComments.propTypes = {
  comments: PropTypes.array,
};

export default PostComments;
