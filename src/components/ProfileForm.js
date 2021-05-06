/* eslint-disable indent */
import {useMedia, useTag, useUsers} from '../hooks/ApiHooks';
import {Grid, Typography, Button} from '@material-ui/core';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {useEffect} from 'react';
import PropTypes from 'prop-types';
import useForm from '../hooks/FormHooks';

const ProfileForm = ({user, setUser, setUpdate}) => {
  const {putUser, getUser} = useUsers();
  const {postMedia} = useMedia();
  const {postTag} = useTag();

  const validators = {
    confirm: ['isPasswordMatch'],
    email: ['required', 'isEmail'],
  };

  const errorMessages = {
    confirm: ['salasanat eivät täsmää'],
    email: ['vaadittu kenttä', 'sähköposti väärää muotoa'],
  };

  const doRegister = async () => {
    try {
      if (inputs.file) {
        const fd = new FormData();
        fd.append('title', inputs.username);
        if (inputs.file.type.includes('image')) {
          fd.append('file', inputs.file);
        } else {
          throw new Error(
            'Looks like you are trying to send something other than an image.',
          );
        }
        const fileResult = await postMedia(fd, localStorage.getItem('token'));
        const tagResult = await postTag(
          localStorage.getItem('token'),
          fileResult.file_id,
          'avatar_' + user.user_id,
        );
        console.log(fileResult, tagResult);
        if (fileResult) {
          setUpdate(true);
        }
      }
      delete inputs.confirm;
      delete inputs.file;
      const result = await putUser(inputs, localStorage.getItem('token'));
      if (result) {
        alert(result.message);
        const userData = await getUser(localStorage.getItem('token'));
        setUser(userData);
        // reset form (password and confirm)
        setInputs((inputs) => ({
          ...inputs,
          password: '',
          confirm: '',
        }));
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const {
    inputs,
    setInputs,
    handleInputChange,
    handleSubmit,
    handleFileChange,
  } = useForm(doRegister, user);

  useEffect(() => {
    ValidatorForm.addValidationRule(
      'isPasswordMatch',
      (value) => value === inputs.password,
    );
  }, [inputs]);

  return (
    <Grid container justify="center" style={{marginTop: '2rem'}}>
      <Grid item xs={12}>
        <Typography
          component="h1"
          variant="h4"
          gutterBottom
          style={{textAlign: 'center'}}
        >
          Update profile
        </Typography>
      </Grid>
      <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container justify="center" direction="column">
            <TextValidator
              fullWidth
              type="password"
              name="password"
              label="Password"
              value={inputs?.password}
              onChange={handleInputChange}
              validators={validators.password}
              errorMessages={errorMessages.password}
            />

            <TextValidator
              fullWidth
              type="password"
              name="confirm"
              label="Confirm password"
              value={inputs?.confirm}
              onChange={handleInputChange}
              validators={validators.confirm}
              errorMessages={errorMessages.confirm}
            />

            <TextValidator
              fullWidth
              type="email"
              name="email"
              label="Email"
              onChange={handleInputChange}
              value={inputs?.email}
              validators={validators.email}
              errorMessages={errorMessages.email}
            />

            <Typography component="h4" variant="h6" gutterBottom>
              Update profile picture
            </Typography>
            <TextValidator
              fullWidth
              type="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{marginBottom: '0.5rem'}}
            />

            <Button color="primary" type="submit" variant="contained">
              Update
            </Button>
          </Grid>
        </ValidatorForm>
      </Grid>
    </Grid>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
  setUpdate: PropTypes.func,
};

export default ProfileForm;
