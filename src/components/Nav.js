/* eslint-disable quote-props */
import {Link as RouterLink} from 'react-router-dom';
import {useEffect, useContext, useState} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';
import {
  AppBar,
  makeStyles,
  Toolbar,
  Typography,
  Button,
  Link,
  Avatar,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import logo from '../gem-logo.svg';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {withStyles} from '@material-ui/core/styles';
import {teal} from '@material-ui/core/colors';

const ProfileButton = withStyles((theme) => ({
  root: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    color: theme.palette.getContrastText(teal[50]),
    backgroundColor: teal[50],
    '&:hover': {
      backgroundColor: teal[200],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    paddingRight: '24px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  itemPack: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    left: '130px',
    transform: 'translate(-50%)',
  },
  logoText: {
    fontFamily: '"Pacifico", cursive',
    fontSize: '2rem',
  },
  logout: {
    borderTop: '1px solid #fefefe',
    borderRight: '1px solid #fefefe',
    borderBottom: '1px solid #fefefe',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: '2.9rem',
    paddingLeft: 15,
  },
  avatar: {
    marginLeft: '18px',
    width: theme.spacing(4.2),
    height: theme.spacing(4.2),
  },
  username: {
    textTransform: 'capitalize',
  },
}));

const Nav = () => {
  const classes = useStyles();
  const [user, setUser] = useContext(MediaContext);
  const {getUser} = useUsers();
  const [avatar, setAvatar] = useState('');
  const {getTag} = useTag();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await getUser(token);
        setUser(userData);
      } catch (e) {
        // console.log('logged out.');
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await getTag('avatar_' + user.user_id);
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
  }, [user]);

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.itemPack}></div>
          <Link
            component={RouterLink}
            to="/"
            className={classes.logo}
            color="inherit"
          >
            <img
              style={{height: '52px', width: '52px', marginRight: '14px'}}
              src={logo}
            ></img>
            <Typography variant="h4" className={classes.logoText}>
              Hidden Gem
            </Typography>
          </Link>

          <div className={classes.itemPack}>
            {user ? (
              <>
                <ProfileButton
                  component={RouterLink}
                  to="/profile"
                  color="inherit"
                  variant="body1"
                >
                  <Typography variant="h6" className={classes.username}>
                    {user.username}
                  </Typography>
                  <Avatar src={avatar} className={classes.avatar} />
                </ProfileButton>
                <Button
                  className={classes.logout}
                  color="inherit"
                  startIcon={<ExitToAppIcon />}
                  component={RouterLink}
                  to="/logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                startIcon={<ExitToAppIcon />}
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
