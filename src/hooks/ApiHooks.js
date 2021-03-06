/* eslint-disable indent */
/* eslint-disable max-len */
import {useContext, useEffect, useState} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {
  appIdentifier,
  baseUrl,
  getCoordsUrl,
  getAddressUrl,
} from '../utils/variables';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};

let posted = 0;

const useUsers = () => {
  const register = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      return await doFetch(baseUrl + 'users', fetchOptions);
    } catch (e) {
      alert(e.message);
    }
  };

  const putUser = async (inputs, token) => {
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(inputs),
    };
    try {
      return await doFetch(baseUrl + 'users', fetchOptions);
    } catch (e) {
      alert(e.message);
    }
  };

  const getUserAvailable = async (username) => {
    try {
      const response = await doFetch(baseUrl + 'users/username/' + username);
      return response.available;
    } catch (e) {
      alert(e.message);
    }
  };

  const getUser = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(baseUrl + 'users/user', fetchOptions);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const getUserById = async (token, id) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(baseUrl + 'users/' + id, fetchOptions);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return {register, getUserAvailable, getUser, getUserById, putUser};
};

const useLogin = () => {
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      return await doFetch(baseUrl + 'login', fetchOptions);
    } catch (e) {
      alert(e.message);
    }
  };

  return {postLogin};
};

// set update to true, if you want to use getMedia automagically
const useMedia = (update = false, ownFiles) => {
  const [picArray, setPicArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useContext(MediaContext);

  if (update) {
    useEffect(() => {
      try {
        (async () => {
          const media = await getMedia();
          setPicArray(media);
        })();
      } catch (e) {
        alert(e.message);
      }
    }, [posted]);
  }

  const getMedia = async () => {
    try {
      setLoading(true);
      const files = await doFetch(baseUrl + 'tags/' + appIdentifier);
      let allFiles = await Promise.all(
        files.map(async (item) => {
          return await doFetch(baseUrl + 'media/' + item.file_id);
        }),
      );
      if (ownFiles && user !== null) {
        allFiles = allFiles.filter((item) => {
          return item.user_id === user.user_id;
        });
      }
      return allFiles;
    } catch (e) {
      throw new Error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const postMedia = async (fd, token) => {
    setLoading(true);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
      },
      body: fd,
    };
    try {
      return await doFetch(baseUrl + 'media', fetchOptions);
    } catch (e) {
      throw new Error('upload failed');
    } finally {
      setLoading(false);
      posted++;
    }
  };

  const putMedia = async (data, id, token) => {
    setLoading(true);
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(baseUrl + 'media/' + id, fetchOptions);
    } catch (e) {
      throw new Error('modify failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (id, token) => {
    setLoading(true);
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const resp = await doFetch(baseUrl + 'media/' + id, fetchOptions);
      if (resp) {
        const media = await getMedia();
        setPicArray(media);
      }
    } catch (e) {
      throw new Error('delete failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    getMedia,
    postMedia,
    putMedia,
    deleteMedia,
    loading,
    picArray,
  };
};

const useTag = () => {
  const postTag = async (token, id, tag = appIdentifier) => {
    const data = {
      file_id: id,
      tag,
    };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(baseUrl + 'tags', fetchOptions);
    } catch (e) {
      throw new Error('tagging failed');
    }
  };

  const getTag = async (tag) => {
    try {
      const response = await doFetch(baseUrl + 'tags/' + tag);
      return response;
    } catch (e) {
      alert(e.message);
    }
  };

  return {postTag, getTag};
};

const useLikes = () => {
  const postLike = async (token, id) => {
    const data = {
      file_id: id,
      rating: 5,
    };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(baseUrl + 'ratings', fetchOptions);
    } catch (e) {
      console.log('liking failed');
    }
  };

  const deleteLike = async (token, id) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(baseUrl + 'ratings/file/' + id, fetchOptions);
    } catch (e) {
      console.log('deleting like failed');
    }
  };

  const getLikes = async (id) => {
    try {
      return await doFetch(baseUrl + 'ratings/file/' + id);
    } catch (e) {
      console.log('getting likes failed');
    }
  };

  return {postLike, getLikes, deleteLike};
};

const useComments = () => {
  const postComment = async (token, id, comment) => {
    const data = {
      file_id: id,
      comment: comment,
    };
    const fetchOptions = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(baseUrl + 'comments', fetchOptions);
    } catch (e) {
      console.log('commenting failed');
    }
  };

  const deleteComment = async (token, id) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(baseUrl + 'comments/' + id, fetchOptions);
    } catch (e) {
      console.log('deleting comment failed');
    }
  };

  const getComments = async (id) => {
    try {
      return await doFetch(baseUrl + 'comments/file/' + id);
    } catch (e) {
      console.log('getting comments failed');
    }
  };

  return {postComment, getComments, deleteComment};
};

const useCoordinates = () => {
  const getCoordinates = async (address, city) => {
    try {
      const response = await doFetch(getCoordsUrl + address + '+' + city);
      return response;
    } catch (e) {
      alert(e.message);
    }
  };
  const getReverseCoordinates = async (lat, lon) => {
    try {
      const response = await doFetch(
        getAddressUrl + 'lat=' + lat + '&lon=' + lon,
      );
      return response;
    } catch (e) {
      alert(e.message);
    }
  };
  return {getCoordinates, getReverseCoordinates};
};

export {
  useLogin,
  useUsers,
  useMedia,
  useTag,
  useCoordinates,
  useLikes,
  useComments,
};
