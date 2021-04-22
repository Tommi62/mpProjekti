import {Grid} from '@material-ui/core';
import Map from '../components/Map';
import {useEffect, useContext, useState} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';
import PlaceInfo from '../components/PlaceInfo';
import AddPlaceForm from '../components/AddPlaceForm';

const Home = () => {
  const [user, setUser] = useContext(MediaContext);
  const [info, setInfo] = useState(false);
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
    setInfo(bool);
  };

  console.log('value', value, user);

  return (
    <>
      <Grid container style={{height: '100%'}}>
        <Grid item xs={3}>
          {info ? (
            <>
              <PlaceInfo data={value} />
            </>
          ) : (
            <>
              <AddPlaceForm />
            </>
          )}
        </Grid>
        <Grid item xs={9}>
          <Map onChange={handleChange} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
