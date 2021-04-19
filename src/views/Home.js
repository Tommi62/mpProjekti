import {Typography, Grid} from '@material-ui/core';
import Map from '../components/Map';

const Home = () => {
  return (
    <>
      <Grid container style={{height: '100%'}}>
        <Grid item xs={3}>
          <Typography component="h1" variant="h2" gutterBottom align="center">
            Home
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Map />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
