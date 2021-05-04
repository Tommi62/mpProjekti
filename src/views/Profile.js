/* eslint-disable indent */
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import MediaTable from '../components/MediaTable';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import BackButton from '../components/BackButton';
import ProfileForm from '../components/ProfileForm';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import CreateIcon from '@material-ui/icons/Create';

const Profile = () => {
  const [user, setUser] = useContext(MediaContext);
  const [avatar, setAvatar] = useState(PersonIcon);
  const [update, setUpdate] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const {getTag} = useTag();

  useEffect(() => {
    (async () => {
      try {
        const result = await getTag('avatar_' + user.user_id);
        if (result.length > 0) {
          const image = result.pop().filename;
          setAvatar(uploadsUrl + image);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [user, update]);

  console.log(avatar);

  return (
    <>
      <BackButton />
      <Typography component="h1" variant="h2" gutterBottom align="center">
        Profile
      </Typography>
      {user && (
        <Grid container justify="center">
          <Card
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardContent>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar variant={'circular'} src={avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary={user.email} />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    setToggleForm(!toggleForm);
                  }}
                >
                  <ListItemIcon>
                    <CreateIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      toggleForm ? 'Close update profile' : 'Update profile'
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      )}
      {toggleForm && (
        <Grid>
          <ProfileForm user={user} setUser={setUser} setUpdate={setUpdate} />
        </Grid>
      )}
      <MediaTable ownFiles={true} user={user} />
    </>
  );
};

export default Profile;
