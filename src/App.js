/* eslint-disable operator-linebreak */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Nav from './components/Nav';
import Home from './views/Home';
import Profile from './views/Profile';
import Login from './views/Login';
import Logout from './views/Logout';
import {MediaProvider} from './contexts/MediaContext';
import {Container, useMediaQuery} from '@material-ui/core';
import useWindowDimensions from './hooks/WindowDimensionsHook';
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {teal, red} from '@material-ui/core/colors';
import {useTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: red[800],
    },
  },
  typography: {},
});

const App = () => {
  const tehme = useTheme();
  const breakpoint = useMediaQuery(tehme.breakpoints.up('sm'));
  const {height} = useWindowDimensions();
  const heightCorrected = height - 65;

  return (
    <ThemeProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <MediaProvider>
          <Container
            maxWidth="xl"
            style={{
              margin: 0,
              padding: 0,
              height: heightCorrected,
            }}
          >
            <Nav />
            <main
              style={
                breakpoint
                  ? {marginTop: 64, height: '100%'}
                  : {marginTop: 56, height: '100%'}
              }
            >
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/profile" component={Profile} />
                <Route path="/logout" component={Logout} />
              </Switch>
            </main>
          </Container>
        </MediaProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
