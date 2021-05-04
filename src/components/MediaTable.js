/* eslint-disable comma-dangle */
/* eslint-disable indent */
import MediaRow from './MediaRow';
import {useMedia} from '../hooks/ApiHooks';
import {
  CircularProgress,
  Grid,
  GridList,
  GridListTile,
  ListSubheader,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const MediaTable = ({ownFiles, user}) => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:697px)');
  const {picArray, loading, deleteMedia} = useMedia(true, ownFiles);

  console.log('MediaTable', picArray);

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={180}
        className={classes.gridList}
        cols={matches ? 6 : 2}
      >
        <GridListTile key="Subheader" cols={6} style={{height: 'auto'}}>
          <ListSubheader component="div">Own posts</ListSubheader>
        </GridListTile>
        {!loading ? (
          picArray.map(
            (item) =>
              user.username == JSON.parse(item.description).username && (
                <GridListTile key={item.file_id}>
                  <MediaRow
                    file={item}
                    ownFiles={ownFiles}
                    deleteMedia={deleteMedia}
                    user={user}
                  />
                </GridListTile>
              )
          )
        ) : (
          <GridListTile>
            <Grid container justify="center">
              <CircularProgress />
            </Grid>
          </GridListTile>
        )}
      </GridList>
    </div>
  );
};

MediaTable.propTypes = {
  ownFiles: PropTypes.bool,
  user: PropTypes.object,
};

export default MediaTable;
