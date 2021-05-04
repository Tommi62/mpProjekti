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
import Card from '@material-ui/core/Card';
import {placeHolder} from '../utils/variables';

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

  // do when unmounted.
  useEffect(() => {
    return () => {
      disableMarker();
    };
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
      if (inputs.file !== null) {
        if (inputs.file.type.includes('image')) {
          fd.append('file', inputs.file);
        } else {
          throw new Error(
            'Looks like you are trying to send something other than an image.'
          );
        }
      } else {
        throw new Error('Choose an image!');
      }

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
    try {
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
          alert('Only images are allowed!');
          setInputs((inputs) => ({
            ...inputs,
            dataUrl: placeHolder,
          }));
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [inputs.file]);

  const handleChange = () => {
    onChange(false);
  };

  const disableMarker = () => {
    setDropped(true);
    setVisible(false);
    setMapHover(false);
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
      <Card
        style={{
          margin: '1rem',
          padding: '2rem 2rem',
          position: 'relative',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom align="center">
          Add a place
        </Typography>
        {!loading ? (
          <ValidatorForm onSubmit={handleSubmit}>
            <TextValidator
              fullWidth
              name="title"
              label="Title"
              value={inputs.title}
              onChange={handleInputChange}
              validators={validators.title}
              errorMessages={errorMessages.title}
            />
            {dropped ? (
              <>
                <TextValidator
                  fullWidth
                  name="address"
                  label="Address"
                  value={inputs.address}
                  onChange={handleInputChange}
                  validators={validators.address}
                  errorMessages={errorMessages.address}
                />
                <TextValidator
                  name="city"
                  label="City"
                  value={inputs.city}
                  onChange={handleInputChange}
                  validators={validators.city}
                  errorMessages={errorMessages.city}
                />
                {mapHover ? (
                  <IconButton
                    aria-label="location"
                    color="secondary"
                    onClick={setLocation}
                    style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '12rem',
                    }}
                  >
                    <AddLocationIcon></AddLocationIcon>
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="location"
                    onClick={setLocation}
                    style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '12rem',
                    }}
                  >
                    <AddLocationIcon></AddLocationIcon>
                  </IconButton>
                )}
              </>
            ) : (
              <>
                <TextValidator
                  fullWidth
                  name="address"
                  label="Address"
                  disabled
                  onChange={handleInputChange}
                  errorMessages={errorMessages.address}
                />
                <TextValidator
                  name="city"
                  label="City"
                  disabled
                  onChange={handleInputChange}
                  errorMessages={errorMessages.city}
                />
                {mapHover ? (
                  <IconButton
                    aria-label="location"
                    color="secondary"
                    onClick={setLocation}
                    style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '12rem',
                    }}
                  >
                    <AddLocationIcon></AddLocationIcon>
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="location"
                    onClick={setLocation}
                    style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '12rem',
                    }}
                  >
                    <AddLocationIcon></AddLocationIcon>
                  </IconButton>
                )}
              </>
            )}
            <TextValidator
              fullWidth
              name="description"
              label="Description"
              value={inputs.description}
              onChange={handleInputChange}
              validators={validators.description}
              errorMessages={errorMessages.description}
            />
            <TextValidator
              fullWidth
              style={{marginTop: '1rem'}}
              type="file"
              name="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {inputs.dataUrl.length > 0 && (
              <>
                <img
                  src={inputs.dataUrl}
                  style={{
                    maxWidth: '50%',
                    marginLeft: '25%',
                    marginBottom: '2rem',
                    marginTop: '2rem',
                  }}
                />
              </>
            )}
            <Button
              style={{marginTop: '2rem'}}
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
            >
              Lähetä
            </Button>
          </ValidatorForm>
        ) : (
          <Grid container justify="center">
            <CircularProgress />
          </Grid>
        )}
      </Card>
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
