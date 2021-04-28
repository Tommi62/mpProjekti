import {Grid} from '@material-ui/core';
import Map from '../components/Map';
import {useEffect, useContext, useState} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';
import PlaceInfo from '../components/PlaceInfo';
import AddPlaceForm from '../components/AddPlaceForm';
import StartInfo from '../components/StartInfo';

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
      <Grid container style={{height: '100%'}}>
        <Grid item xs={3}>
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
                  mapHover={mapHover} />
              ) : (
                <StartInfo
                  user={user}
                  onChange={handleStartInfoChange}
                  setInitialPosition={setInitialPosition}
                  setClicked={setClicked}
                />
              )}
            </>
          )}
        </Grid>
        <Grid item xs={9}>
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
            initialPosition={initialPosition} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
