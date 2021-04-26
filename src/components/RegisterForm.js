/* eslint-disable comma-dangle */
/* eslint-disable indent */
import useForm from '../hooks/FormHooks';
import {useUsers} from '../hooks/ApiHooks';
import {Grid, Typography, Button} from '@material-ui/core';
// import {useState} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useEffect} from 'react';
import PropTypes from 'prop-types';

const RegisterForm = ({setToggle}) => {
  const {register, getUserAvailable} = useUsers();
  const validators = {
    username: ['required', 'minStringLength: 3', 'isAvailable'],
    password: ['required', 'minStringLength:5'],
    confirm: ['required', 'isPasswordMatch'],
    email: ['required', 'isEmail'],
    // eslint-disable-next-line max-len
  };

  const errorMessages = {
    username: ['vaadittu kenttä', 'vähintään 3 merkkiä', 'tunnus ei oo vapaa'],
    password: ['vaadittu kenttä', 'vähintään 5 merkkiä'],
    confirm: ['vaadittu kenttä', 'salasanat eivät täsmää'],
    email: ['vaadittu kenttä', 'sähköposti väärää muotoa'],
  };

  const doRegister = async () => {
    try {
      console.log('rekisteröinti lomake lähtee');
      const available = await getUserAvailable(inputs.username);
      console.log('availabale', available);
      if (available) {
        delete inputs.confirm;
        const result = await register(inputs);
        if (result.message.length > 0) {
          alert(result.message);
          setToggle(true);
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const {inputs, handleInputChange, handleSubmit} = useForm(doRegister, {
    username: '',
    password: '',
    confirm: '',
    email: '',
  });

  useEffect(() => {
    ValidatorForm.addValidationRule('isAvailable', async (value) => {
      if (value.length > 2) {
        try {
          const available = await getUserAvailable(value);
          console.log('onk vapaana', available);
          return available;
        } catch (e) {
          console.log(e.message);
          return true;
        }
      }
    });

    ValidatorForm.addValidationRule(
      'isPasswordMatch',
      (value) => value === inputs.password
    );
  }, [inputs]);

  // console.log('RegisterForm', inputs);

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
          Register
        </Typography>
      </Grid>
      <Grid item xs={12} container direction="column" alignItems="center">
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container direction="column">
            <Grid container item>
              <TextValidator
                fullWidth
                type="text"
                name="username"
                label="Username"
                onChange={handleInputChange}
                value={inputs.username}
                validators={validators.username}
                errorMessages={errorMessages.username}
              />
            </Grid>

            <Grid container item>
              <TextValidator
                fullWidth
                type="password"
                name="password"
                label="Password"
                onChange={handleInputChange}
                value={inputs.password}
                validators={validators.password}
                errorMessages={errorMessages.password}
              />
            </Grid>

            <Grid container item>
              <TextValidator
                fullWidth
                type="password"
                name="confirm"
                label="Confirm password"
                onChange={handleInputChange}
                value={inputs.confirm}
                validators={validators.confirm}
                errorMessages={errorMessages.confirm}
              />
            </Grid>

            <Grid container item>
              <TextValidator
                fullWidth
                type="email"
                name="email"
                label="Email"
                onChange={handleInputChange}
                value={inputs.email}
                validators={validators.email}
                errorMessages={errorMessages.email}
              />
            </Grid>

            <Grid container item>
              <Button
                fullWidth
                color="primary"
                type="submit"
                variant="contained"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </ValidatorForm>
      </Grid>
    </Grid>
  );
};

RegisterForm.propTypes = {
  setToggle: PropTypes.func,
};

export default RegisterForm;
