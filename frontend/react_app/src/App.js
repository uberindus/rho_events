import React from 'react';
import { Header }  from "./features/header/Header"
import { SignUp }  from "./features/auth/SignUp"
import { Login }  from "./features/auth/Login"
import { Cabinet } from "./features/cabinet/Cabinet"
import { AddEvent } from "./features/events/AddEvent"
import { PublicEventsList } from "./features/events/PublicEventsList"
import { EventEdit } from "./features/events/EventEdit"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import {useGetRegionalBranchesQuery,
        useGetProffInterestsQuery,
        useGetAcademicTitlesQuery,
        useGetOrganizationsQuery, } from "./api";
import { createBrowserHistory } from 'history';
import { Moderation } from './features/moderation/Moderation';
import { UserEditPage } from './features/users/UserEditPage';
import { refreshStatus, selectIsLoggedIn, selectIsModerator } from './features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { PublicEventPage } from './features/events/PublicEventPage';

const history = createBrowserHistory();

function App() {

  useGetRegionalBranchesQuery()
  useGetProffInterestsQuery()
  useGetOrganizationsQuery()
  useGetAcademicTitlesQuery()

  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => selectIsLoggedIn(state))
  const isStatusRefreshed = useSelector(state => state.auth.isStatusRefreshed)

  if (isLoggedIn && !isStatusRefreshed){
    dispatch(refreshStatus()).unwrap().catch(err => console.error("Refreshing of status failed"))
  }

  const is_moderator = useSelector(state => selectIsModerator(state))
  return (
    <Router history={history}>
      <Header />
      <div className="main">
        <div className="content">
          <Switch>
            <Route path="/signup" component={SignUp}/>
            <Route path="/login" component={Login}/>
            <Route path="/cabinet" component={Cabinet} />
            <Route path="/add-event" component={AddEvent} />
            <Route path="/edit-event/:id" component={EventEdit} />
            <Route exact path="/" component={PublicEventsList} />
            <Route path="/public-events/:id" component={PublicEventPage} />
            {is_moderator ?
              <React.Fragment>
                <Route path="/moderation" component={Moderation} />
                <Route path="/edit-user/:id" component={UserEditPage} />
              </React.Fragment>
              :
              null
            }
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
