import {Grid} from '@material-ui/core';
import AddPlaceForm from '../components/AddPlaceForm';
import Map from '../components/Map';

const Home = () => {
  return (
    <>
      <Grid container style={{height: '100%'}}>
        <Grid item xs={3}>
          <AddPlaceForm />
        </Grid>
        <Grid item xs={9}>
          <Map />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
