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
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import logo from '../gem-logo.svg';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

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
    left: '50%',
    transform: 'translate(-50%)',
  },
  logoText: {
    fontFamily: '"Pacifico", cursive',
  },
  logout: {
    paddingLeft: '24px',
  },
  avatar: {
    marginLeft: '12px',
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
          <div className={classes.itemPack}>
            <HomeIcon></HomeIcon>
            <Typography variant="h6" className={classes.title}>
              <Link component={RouterLink} to="/" color="inherit">
                Home
              </Link>
            </Typography>
            {user && (
              <>
                <AccountBoxIcon></AccountBoxIcon>
                <Typography variant="h6" className={classes.title}>
                  <Link component={RouterLink} to="/profile" color="inherit">
                    Profile
                  </Link>
                </Typography>
              </>
            )}
          </div>
          <div className={classes.logo}>
            <img
              style={{height: '52px', width: '52px', marginRight: '6px'}}
              src={logo}
            ></img>
            <Typography variant="h4" className={classes.logoText}>
              Hidden Gem
            </Typography>
          </div>
          <div className={classes.itemPack}>
            {user ? (
              <>
                <Typography variant="h6">{user.username}</Typography>
                <Avatar src={avatar} className={classes.avatar} />
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
