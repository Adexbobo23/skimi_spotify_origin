import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setToken } from './store/actions/sessionActions';
import { fetchUser } from './store/actions/userActions';

import Spinner from './components/spinner/spinner';
import LeftSection from './containers/leftSection/leftSection';
import MainSection from './containers/mainSection/mainSection';
import RightSection from './containers/rightSection/rightSection';

import Login from './spotify/login';
import WebPlaybackReact from './spotify/webPlayback';

window.onSpotifyWebPlaybackSDKReady = () => {};

class App extends Component {
  state = {
    playerLoaded: false,
  };

  componentDidMount() {
    const token = Login.getToken();
    if (!token) {
      Login.logInWithSpotify();
    } else {
      this.setState({ token: token });
      this.props.setToken(token);
      this.props.fetchUser();
    }
  }

  render() {
    let webPlaybackSdkProps = {
      playerName: 'Spotify React Player',
      playerInitialVolume: 1.0,
      playerRefreshRateMs: 1000,
      playerAutoConnect: true,
      onPlayerRequestAccessToken: () => this.state.token,
      onPlayerLoading: () => {},
      onPlayerWaitingForDevice: () => {
        this.setState({ playerLoaded: true });
      },
      onPlayerError: (e) => {
        console.log(e);
      },
      onPlayerDeviceSelected: () => {
        this.setState({ playerLoaded: true });
      },
    };

    return (
      <div style={styles.body}>
        <div className='app' style={styles.app}>
          <WebPlaybackReact {...webPlaybackSdkProps}>
            <Spinner loading={!this.state.playerLoaded}>
              <LeftSection />
              <MainSection />
              <RightSection />
            </Spinner>
          </WebPlaybackReact>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.sessionReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setToken(token)),
  fetchUser: () => dispatch(fetchUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = {
  body: {
    background: '#181818',
    fontFamily: 'Proxima Nova, Georgia, sans-serif',
    color: 'white',
    margin: 0,
    padding: 0,
    cursor: 'default',
  },
  app: {
    display: 'flex',
    position: 'relative',
  },
  mainSection: {
    position: 'relative',
    margin: 'auto',
    marginBottom: '100px',
  },
  mainSectionContainer: {
    position: 'relative',
    top: '50px',
    paddingBottom: '50px',
  },
  '@media (max-width: 1100px)': {
    mainSection: {
      paddingLeft: '200px',
    },
    rightSection: {
      display: 'none',
    },
  },
  '@media (max-width: 700px)': {
    mainSection: {
      paddingLeft: '0px',
    },
    leftSection: {
      display: 'none',
    },
  },
};
