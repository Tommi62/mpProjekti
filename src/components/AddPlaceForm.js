/* eslint-disable comma-dangle */
/* eslint-disable indent */
import {useCoordinates, useMedia, useTag, useUsers} from '../hooks/ApiHooks';
import {CircularProgress, Button, Grid, Typography} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import useUploadForm from '../hooks/UploadHooks';

const AddPlaceForm = () => {
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {getCoordinates} = useCoordinates();
  const [user, setUser] = useState(null);
  const {getUser} = useUsers();

  const validators = {
    title: ['required', 'minStringLength: 3'],
    description: ['minStringLength: 5'],
    address: ['required', 'minStringLength: 3'],
    city: ['required', 'minStringLength: 3'],
  };

  const errorMessages = {
    title: ['Vaadittu kenttä!', 'Vähintään kolme merkkiä!'],
    description: ['vähintään 5 merkkiä'],
    address: ['Vaadittu kenttä!', 'Vähintään kolme merkkiä!'],
    city: ['Vaadittu kenttä!', 'Vähintään kolme merkkiä!'],
  };

  useEffect(() => {
    (async () => {
      try {
        setUser(await getUser(localStorage.getItem('token')));
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, []);

  const doUpload = async () => {
    try {
      const coords = await getCoordinates(inputs.address, inputs.city);
      if (coords === undefined || coords.length == 0) {
        throw new Error('Address not found');
      }
      console.log('Coords', coords[0].lat);
      const fd = new FormData();
      fd.append('title', inputs.title);
      const desc = {
        description: inputs.description,
        address: inputs.address,
        city: inputs.city,
        lat: coords[0].lat,
        lng: coords[0].lon,
        username: user.username,
      };
      fd.append('description', JSON.stringify(desc));
      fd.append('file', inputs.file);
      const result = await postMedia(fd, localStorage.getItem('token'));
      const tagResult = await postTag(
        localStorage.getItem('token'),
        result.file_id
      );
      console.log('doUpload', result, tagResult);
      console.log('desc', desc);
    } catch (e) {
      alert(e.message);
    }
  };

  const {
    inputs,
    handleInputChange,
    handleSubmit,
    handleFileChange,
    setInputs,
  } = useUploadForm(doUpload, {
    title: '',
    description: '',
    file: null,
    dataUrl: '',
  });

  useEffect(() => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      setInputs((inputs) => ({
        ...inputs,
        dataUrl: reader.result,
      }));
    });

    if (inputs.file !== null) {
      if (inputs.file.type.includes('image')) {
        reader.readAsDataURL(inputs.file);
      } else {
        setInputs((inputs) => ({
          ...inputs,
          dataUrl: 'logo512.png',
        }));
      }
    }
  }, [inputs.file]);

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Typography component="h1" variant="h2" gutterBottom align="center">
          Add a place
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {!loading ? (
          <ValidatorForm onSubmit={handleSubmit}>
            <Grid container>
              <Grid container item>
                <TextValidator
                  fullWidth
                  name="title"
                  label="Title"
                  value={inputs.title}
                  onChange={handleInputChange}
                  validators={validators.title}
                  errorMessages={errorMessages.title}
                />
              </Grid>
              <Grid container item>
                <TextValidator
                  fullWidth
                  name="address"
                  label="Address"
                  value={inputs.address}
                  onChange={handleInputChange}
                  validators={validators.address}
                  errorMessages={errorMessages.address}
                />
              </Grid>
              <Grid container item>
                <TextValidator
                  fullWidth
                  name="city"
                  label="City"
                  value={inputs.city}
                  onChange={handleInputChange}
                  validators={validators.city}
                  errorMessages={errorMessages.city}
                />
              </Grid>
              <Grid container item>
                <TextValidator
                  fullWidth
                  name="description"
                  label="Description"
                  value={inputs.description}
                  onChange={handleInputChange}
                  validators={validators.description}
                  errorMessages={errorMessages.description}
                />
              </Grid>
              <Grid container item>
                <TextValidator
                  fullWidth
                  type="file"
                  name="file"
                  accept="image/*, audio/*, video/*"
                  onChange={handleFileChange}
                />
              </Grid>
              <Grid container item>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Lähetä
                </Button>
              </Grid>
              {inputs.dataUrl.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <img
                      src={inputs.dataUrl}
                      style={{
                        maxWidth: '50%',
                        marginLeft: '25%',
                        marginBottom: '2rem',
                        marginTop: '2rem',
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </ValidatorForm>
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </Grid>
  );
};

export default AddPlaceForm;
