import {useContext} from 'react';
import useForm from '../hooks/FormHooks';
import {useLogin} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MediaContext} from '../contexts/MediaContext';
import {Button, Grid, TextField, Typography} from '@material-ui/core';

const LoginForm = ({history}) => {
  const [user, setUser] = useContext(MediaContext);
  const {postLogin} = useLogin();

  const doLogin = async () => {
    try {
      const userdata = await postLogin(inputs);
      localStorage.setItem('token', userdata.token);
      setUser(userdata.user);
      history.push('/');
    } catch (e) {
      console.log('doLogin', e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(doLogin, {
    username: '',
    password: '',
  });

  console.log('LoginForm', inputs, user);

  return (
    <Grid container>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Typography component="h1" variant="h2" gutterBottom>
          Login
        </Typography>
      </Grid>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <form onSubmit={handleSubmit}>
          <Grid container direction="column">
            <Grid container item>
              <TextField
                type="text"
                name="username"
                label="Username"
                onChange={handleInputChange}
                value={inputs.username}
              />
            </Grid>
            <Grid container item>
              <TextField
                type="password"
                name="password"
                label="Password"
                onChange={handleInputChange}
                value={inputs.password}
              />
            </Grid>

            <Grid container item>
              <Button
                fullWidth
                style={{marginTop: '2rem', marginBottom: '0.5rem'}}
                color="primary"
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

LoginForm.propTypes = {
  history: PropTypes.object,
};

export default withRouter(LoginForm);
