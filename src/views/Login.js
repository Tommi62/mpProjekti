import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Grid} from '@material-ui/core';
import {useState} from 'react';

const Login = () => {
  const [toggle, setToggle] = useState(true);

  const showHide = () => {
    setToggle(!toggle);
  };

  return (
    <>
      {toggle ? <LoginForm /> : <RegisterForm setToggle={setToggle} />}
      <Grid container justify="center">
        <Button justify='center'
          onClick={showHide}>{toggle ? 'or register' : 'or login'}</Button>
      </Grid>
    </>
  );
};

export default Login;
