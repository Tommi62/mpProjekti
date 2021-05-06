import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Button, Grid} from '@material-ui/core';
import {useState} from 'react';
import Card from '@material-ui/core/Card';

const Login = () => {
  const [toggle, setToggle] = useState(true);

  const showHide = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <Grid container justify="center">
        <Card
          style={{
            margin: '5rem 2rem 3rem 2rem',
            padding: '3rem',
            maxWidth: '18rem',
          }}
        >
          {toggle ? <LoginForm /> : <RegisterForm setToggle={setToggle} />}
          <Grid container justify="center">
            <Button justify="center" onClick={showHide}>
              {toggle ? 'or register' : 'or login'}
            </Button>
          </Grid>
        </Card>
      </Grid>
    </>
  );
};

export default Login;
