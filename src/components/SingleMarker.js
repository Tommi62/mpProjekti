import PropTypes from 'prop-types';
import * as L from 'leaflet';
import logo from '../gem-logo.svg';
import {Marker} from 'react-leaflet';
import {useLikes} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';

const SingleMarker = ({onChange, item, setOpen}) => {
  const {getLikes} = useLikes();
  const [hiddenGem, setHiddenGem] = useState(false);
  const [update, setUpdate] = useState(false);

  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const gemIcon = new LeafIcon({
    iconUrl: logo,
    iconSize: [60, 60],
    iconAnchor: [29, 54],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const blueIcon = new LeafIcon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const handleChange = (item) => {
    onChange(item, true);
    setOpen(true);
    if (update) {
      setUpdate(false);
    } else {
      setUpdate(true);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let likeCount = 0;
        const postLikes = await getLikes(item.file_id);
        postLikes.map((likeObject) => {
          likeCount++;
        });
        if (likeCount >= 2) {
          setHiddenGem(true);
        } else {
          setHiddenGem(false);
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [item, update]);

  return (
    <>
      {hiddenGem ? (
        <Marker
          icon={gemIcon}
          position={[
            JSON.parse(item.description).lat,
            JSON.parse(item.description).lng,
          ]}
          eventHandlers={{
            click: () => {
              handleChange(item);
            },
          }}
        />
      ) : (
        <Marker
          icon={blueIcon}
          position={[
            JSON.parse(item.description).lat,
            JSON.parse(item.description).lng,
          ]}
          eventHandlers={{
            click: () => {
              handleChange(item);
            },
          }}
        />
      )}
    </>
  );
};

SingleMarker.propTypes = {
  onChange: PropTypes.func,
  item: PropTypes.object,
  setOpen: PropTypes.func,
};

export default SingleMarker;
