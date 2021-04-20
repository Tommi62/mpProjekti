/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Nav from './components/Nav';
import Home from './views/Home';
import Profile from './views/Profile';
import Login from './views/Login';
import Logout from './views/Logout';
import {MediaProvider} from './contexts/MediaContext';
import {Container} from '@material-ui/core';
import useWindowDimensions from './hooks/WindowDimensionsHook';

const App = () => {
  const {height} = useWindowDimensions();
  const heightCorrected = height - 65;

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <MediaProvider>
        <Container
          maxWidth="xl"
          style={{margin: 0, padding: 0, height: heightCorrected}}
        >
          <Nav />
          <main style={{marginTop: 65, height: '100%'}}>
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
  );
};

export default App;
