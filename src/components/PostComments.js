import {
  Avatar,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {PropTypes} from 'prop-types';
import {useState, useEffect} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const PostComments = ({comments}) => {
  const [avatar, setAvatar] = useState('');
  const {getTag} = useTag();

  useEffect(() => {
    (async () => {
      try {
        const result = await getTag('avatar_' + comments[0].user_id);
        console.log('RESULTTI: ' + result);
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
  }, [comments]);

  console.log('POSTCOMMENTS: ' + comments);
  const data = comments.map((item) => (
    <>
      <List>
        <Avatar
          variant={'round'}
          src={avatar}
          style={{marginRight: '0.5rem'}}
        />
        <ListItem>
          <ListItemText primary={item.comment} />
        </ListItem>
      </List>
    </>
  ));
  return data;
};

PostComments.propTypes = {
  comments: PropTypes.array,
};

export default PostComments;
