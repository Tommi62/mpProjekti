import PropTypes from 'prop-types';
import * as L from 'leaflet';
import logo from '../gem-logo2.svg';
import gemMarker from '../gem-marker.png';
import {Typography} from '@material-ui/core';
import {Marker, Tooltip} from 'react-leaflet';
import {useLikes} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    border: 0,
    top: '-25px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.15s linear',
  },
}));


const SingleMarker = ({onChange, item, setOpen}) => {
  const classes = useStyles();
  const {getLikes} = useLikes();
  const [hiddenGem, setHiddenGem] = useState(false);
  const [update, setUpdate] = useState(false);
  const [likes, setLikes] = useState(0);

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

  const greyIcon = new LeafIcon({
    iconUrl: gemMarker,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 42],
    iconAnchor: [15, 44],
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
        setLikes(likeCount);
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
            mouseover: () => {
              if (update) {
                setUpdate(false);
              } else {
                setUpdate(true);
              }
            },
          }}
        >
          <Tooltip>
            <Typography
              component="p"
              variant="h6"
              align="center"
              color="disabled"
            >
              {likes}
            </Typography>
            <FavoriteIcon color="disabled" />
          </Tooltip>
        </Marker>
      ) : (
        <Marker
          icon={greyIcon}
          position={[
            JSON.parse(item.description).lat,
            JSON.parse(item.description).lng,
          ]}
          eventHandlers={{
            click: () => {
              handleChange(item);
            },
            mouseover: () => {
              if (update) {
                setUpdate(false);
              } else {
                setUpdate(true);
              }
            },
          }}
        ><Tooltip className={classes.tooltip} offset={L.point(15, 0)}>
            <Typography
              component="p"
              variant="h6"
              align="center"
              color="disabled"
            >
              {likes}
            </Typography>
            <FavoriteIcon color="disabled" />
          </Tooltip>
        </Marker>
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
