/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {GridListTileBar} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import ProfileModal from './ProfileModal';
import {useEffect, useState} from 'react';
import {useLikes} from '../hooks/ApiHooks';

const MediaRow = ({file, ownFiles, user}) => {
  const {getLikes} = useLikes();
  const [gem, setGem] = useState(false);
  const [multiplier, setMultiplier] = useState('');
  const [likes, setLikes] = useState(0);
  const lowerLimit = 5;

  let desc = {}; // jos kuva tallennettu ennen week4C, description ei ole JSONia
  try {
    desc = JSON.parse(file.description);
    console.log(desc);
  } catch (e) {
    desc = {description: file.description};
  }

  useEffect(() => {
    (async () => {
      try {
        let likeCount = 0;
        const postLikes = await getLikes(file.file_id);
        postLikes.map((likeObject) => {
          likeCount++;
        });
        setLikes(likeCount);
        if (likeCount >= lowerLimit) {
          setGem(true);
          if (likeCount / lowerLimit >= 2) {
            setMultiplier(Math.floor(likeCount / lowerLimit));
          } else {
            setMultiplier('');
          }
        } else {
          setGem(false);
          setMultiplier('');
        }
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [file]);

  return (
    <>
      <img src={uploadsUrl + file.thumbnails?.w320} alt={file.title} />
      {gem ? (
        <GridListTileBar
          title={file.title}
          subtitle={ownFiles || desc.description}
          actionIcon={
            <>
              {ownFiles && (
                <>
                  <ProfileModal
                    post={file}
                    gem={gem}
                    multiplier={multiplier}
                    likes={likes}
                  />
                </>
              )}
            </>
          }
          style={{backgroundColor: 'rgba(0, 137, 123, 0.5)'}}
        />
      ) : (
        <GridListTileBar
          title={file.title}
          subtitle={ownFiles || desc.description}
          actionIcon={
            <>
              {ownFiles && (
                <>
                  <ProfileModal
                    post={file}
                    gem={gem}
                    multiplier={multiplier}
                    likes={likes}
                  />
                </>
              )}
            </>
          }
        />
      )}

      <></>
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object,
  ownFiles: PropTypes.bool,
  user: PropTypes.object,
};

export default withRouter(MediaRow);
