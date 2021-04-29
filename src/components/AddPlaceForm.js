/* eslint-disable comma-dangle */
/* eslint-disable indent */
import {useCoordinates, useMedia, useTag, useUsers} from '../hooks/ApiHooks';
import {CircularProgress, Button, Grid, Typography} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import useUploadForm from '../hooks/UploadHooks';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import {IconButton} from '@material-ui/core';
import AddLocationIcon from '@material-ui/icons/AddLocation';

const AddPlaceForm = ({
  onChange,
  setMapHover,
  hoverCoordinates,
  dropped,
  setDropped,
  mapHover,
  setVisible,
}) => {
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {getCoordinates, getReverseCoordinates} = useCoordinates();
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
    let desc = {};
    const fd = new FormData();
    try {
      if (dropped) {
        const coords = await getCoordinates(inputs.address, inputs.city);
        if (coords === undefined || coords.length == 0) {
          throw new Error('Address not found');
        }
        console.log('Coords', coords[0].lat);
        fd.append('title', inputs.title);
        desc = {
          description: inputs.description,
          address: inputs.address,
          city: inputs.city,
          lat: coords[0].lat,
          lng: coords[0].lon,
          username: user.username,
        };
      } else {
        console.log(
          'coords and state: ' +
          hoverCoordinates.lat +
          ' ' +
          hoverCoordinates.lng
        );
        const address = await getReverseCoordinates(
          hoverCoordinates.lat,
          hoverCoordinates.lng
        );
        if (address === undefined || address.length == 0) {
          throw new Error('Coords not found');
        }
        console.log('Coords', address);
        fd.append('title', inputs.title);
        desc = {
          description: inputs.description,
          address: address.address.road,
          city: address.address.city,
          lat: hoverCoordinates.lat,
          lng: hoverCoordinates.lng,
          username: user.username,
        };
      }
      fd.append('description', JSON.stringify(desc));
      fd.append('file', inputs.file);
      const result = await postMedia(fd, localStorage.getItem('token'));
      const tagResult = await postTag(
        localStorage.getItem('token'),
        result.file_id
      );
      console.log('doUpload', result, tagResult);
      console.log('desc', desc);
      handleChange();
      setDropped(true);
      setVisible(false);
      setMapHover(false);
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

  const handleChange = () => {
    onChange(false);
  };

  const setLocation = () => {
    if (mapHover) {
      setDropped(true);
      setVisible(false);
      setMapHover(false);
    } else {
      setMapHover(true);
    }
  };

  return (
    <Grid container justify="center">
      <Grid container justify="flex-end">
        <CloseButton onChange={onChange} />
      </Grid>
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
              {dropped ? (
                <>
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
                </>
              ) : (
                <>
                  <Grid container item>
                    <TextValidator
                      fullWidth
                      name="address"
                      label="Address"
                      disabled
                      onChange={handleInputChange}
                      errorMessages={errorMessages.address}
                    />
                  </Grid>
                  <Grid container item>
                    <TextValidator
                      fullWidth
                      name="city"
                      label="City"
                      disabled
                      onChange={handleInputChange}
                      errorMessages={errorMessages.city}
                    />
                  </Grid>
                </>
              )}
              {mapHover ? (
                <IconButton
                  aria-label="location"
                  color="primary"
                  onClick={setLocation}
                >
                  <AddLocationIcon></AddLocationIcon>
                </IconButton>
              ) : (
                <IconButton aria-label="location" onClick={setLocation}>
                  <AddLocationIcon></AddLocationIcon>
                </IconButton>
              )}
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

AddPlaceForm.propTypes = {
  onChange: PropTypes.func,
  setMapHover: PropTypes.func,
  hoverCoordinates: PropTypes.string,
  dropped: PropTypes.bool,
  mapHover: PropTypes.bool,
  setDropped: PropTypes.func,
  setVisible: PropTypes.func,
};

export default AddPlaceForm;
