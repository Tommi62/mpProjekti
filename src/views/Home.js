/* eslint-disable quote-props */
import Map from '../components/Map';
import {useEffect, useContext, useState} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';
import PlaceInfo from '../components/PlaceInfo';
import AddPlaceForm from '../components/AddPlaceForm';
import StartInfo from '../components/StartInfo';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {grey} from '@material-ui/core/colors';

const drawerWidth = 420;

const SliderButton = withStyles((theme) => ({
  root: {
    height: 80,
    minWidth: 10,
    padding: 2,
    border: '1px solid ' + grey[300],
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    color: theme.palette.getContrastText(grey[300]),
    backgroundColor: grey[100],
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    paddingTop: '64px',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    width: '100%',
    height: '100%',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    width: '100%',
    height: '100%',
    float: 'right',
    marginLeft: 0,
  },
  opener: {
    position: 'absolute',
    top: '50%',
    left: '0',
    zIndex: '801',
    transition: theme.transitions.create(['left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  openerShift: {
    position: 'absolute',
    top: '50%',
    left: drawerWidth,
    zIndex: '801',
    transition: theme.transitions.create(['left'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  flip: {
    opacity: 0.5,
    width: 20,
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  flipShift: {
    transform: 'rotate(180deg)',
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Home = () => {
  const [user, setUser] = useContext(MediaContext);
  const [placeInfo, setPlaceInfo] = useState(false);
  const [startInfo, setStartInfo] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [mapHover, setMapHover] = useState(false);
  const [hoverCoordinates, setHoverCoordinates] = useState({lat: 10, lng: 10});
  const [dropped, setDropped] = useState(true);
  const [visible, setVisible] = useState(false);
  const {getUser} = useUsers();
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await getUser(token);
        setUser(userData);
      } catch (e) {
        console.log('logged out.');
      }
    };

    checkUser();
  }, []);

  const [value, setValue] = useState({
    file_id: '',
    title: '',
    description: '',
    address: '',
    city: '',
    username: '',
    file: '',
    user_id: '',
  });

  const handleChange = (newValue, bool) => {
    setValue({
      file_id: newValue.file_id,
      title: newValue.title,
      description: JSON.parse(newValue.description).description,
      address: JSON.parse(newValue.description).address,
      city: JSON.parse(newValue.description).city,
      username: JSON.parse(newValue.description).username,
      file: newValue.filename,
      user_id: newValue.user_id,
    });
    setPlaceInfo(bool);
  };

  const handleStartInfoChange = (bool) => {
    setStartInfo(bool);
  };

  return (
    <>
      <SliderButton
        onClick={open ? handleDrawerClose : handleDrawerOpen}
        className={clsx(classes.opener, {
          [classes.openerShift]: open,
        })}
      >
        <ChevronRightIcon
          className={clsx(classes.flip, {
            [classes.flipShift]: open,
          })}
        />
      </SliderButton>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {placeInfo ? (
          <>
            <PlaceInfo data={value} user={user} onChange={setPlaceInfo} />
          </>
        ) : (
          <>
            {startInfo ? (
              <AddPlaceForm
                hoverCoordinates={hoverCoordinates}
                setMapHover={setMapHover}
                onChange={handleStartInfoChange}
                setVisible={setVisible}
                setDropped={setDropped}
                dropped={dropped}
                mapHover={mapHover}
              />
            ) : (
              <StartInfo user={user} onChange={handleStartInfoChange} />
            )}
          </>
        )}
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Map
          mapHover={mapHover}
          onChange={handleChange}
          setHoverCoordinates={setHoverCoordinates}
          dropped={dropped}
          setDropped={setDropped}
          setClicked={setClicked}
          clicked={clicked}
          setVisible={setVisible}
          visible={visible}
          initialPosition={initialPosition}
          drawerWidth={drawerWidth}
          setOpen={setOpen}
          setInitialPosition={setInitialPosition}
        ></Map>
      </div>
    </>
  );
};

export default Home;
