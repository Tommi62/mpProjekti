/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {GridListTileBar} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import ProfileModal from './ProfileModal';

const MediaRow = ({file, ownFiles, history, deleteMedia}) => {
  let desc = {}; // jos kuva tallennettu ennen week4C, description ei ole JSONia
  try {
    desc = JSON.parse(file.description);
    console.log(desc);
  } catch (e) {
    desc = {description: file.description};
  }

  return (
    <>
      <img src={uploadsUrl + file.thumbnails?.w320} alt={file.title} />
      <GridListTileBar
        title={file.title}
        subtitle={ownFiles || desc.description}
        actionIcon={
          <>
            {ownFiles && (
              <>
                <ProfileModal post={file}></ProfileModal>
              </>
            )}
          </>
        }
      />
      <></>
    </>
  );
};

MediaRow.propTypes = {
  file: PropTypes.object,
  ownFiles: PropTypes.bool,
  history: PropTypes.object,
  deleteMedia: PropTypes.func,
};

export default withRouter(MediaRow);
