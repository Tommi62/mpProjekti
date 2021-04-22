import {Grid} from '@material-ui/core';
// import AddPlaceForm from '../components/AddPlaceForm';
import Map from '../components/Map';
import {useEffect, useContext, useState} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';
import PlaceInfo from '../components/PlaceInfo';

const Home = () => {
  const [user, setUser] = useContext(MediaContext);
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
    title: '',
    description: {
      description: '',
      address: '',
      city: '',
    },
    file: '',
    file_id: '',
  });

  const handleChange = (newValue) => {
    setValue({
      title: newValue.title,
      description: {
        description: JSON.parse(newValue.description).description,
        address: JSON.parse(newValue.description).address,
        city: JSON.parse(newValue.description).city,
      },
      file: newValue.filename,
      file_id: newValue.file_id,
    });
  };
  console.log('value', value);
  return (
    <>
      <Grid container style={{height: '100%'}}>
        <Grid item xs={3}>
          {user && (
            <>
              <PlaceInfo
                data={value}
                user={user}
              />
            </>
          )}
        </Grid>
        <Grid item xs={9}>
          <Map value={value} onChange={handleChange} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
