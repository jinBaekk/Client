import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AppEntrance from '../../components/AppEntrance';
import AppHeader from '../../components/AppHeader';
import { setCurrentUser, setHasToken, initializeStore } from '../../actions';
import Loading from '../../components/shared/Loading';

function AppContainer({
  hasToken,
  currentUser,
  onLogin,
  onLogout,
}) {
  const history = useHistory();

  useEffect(() => {
    if (!hasToken) {
      history.push('/login');

      return;
    }

    async function getUserData() {
      const res = await fetch('http://localhost:4000/users/current-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(process.env.REACT_APP_GOOGIT_LOGIN_TOKEN)}`,
        },
      });

      const response = await res.json();

      if (response.result === 'failure') {
        alert('이용자 정보를 불러오지 못했습니다');

        return;
      }

      onLogin(response.user);
    }

    getUserData();
  }, []);

  return (
    <>
      {
        !hasToken
        && <AppEntrance onLogin={onLogin} />
      }
      {
        hasToken && !currentUser
        && <Loading text="이용자 정보를 불러오고 있어요" />
      }
      {
        hasToken && currentUser
        && <AppHeader onLogout={onLogout} />
      }
    </>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin(user) {
      dispatch(setHasToken());
      dispatch(setCurrentUser(user));
    },
    onLogout() {
      dispatch(initializeStore());
    },
  };
}

function mapStateToProps(state) {
  return {
    hasToken: state.hasToken,
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
