import {Grid} from '@material-ui/core';
import AddPlaceForm from '../components/AddPlaceForm';
import Map from '../components/Map';
import {useEffect, useContext} from 'react';
import {useUsers} from '../hooks/ApiHooks';
import {MediaContext} from '../contexts/MediaContext';

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

  return (
    <>
      <Grid container style={{height: '100%'}}>
        <Grid item xs={3}>
          {user && (
            <>
              <AddPlaceForm />
            </>
          )}
        </Grid>
        <Grid item xs={9}>
          <Map />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
