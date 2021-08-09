import React from 'react'
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
  } from "react-router-dom";
import { EditbleEventsList } from '../events/EditbleEventsList';
import { UserList } from '../users/UserList';

export const Moderation = () => {
    let match = useRouteMatch();
    return(
        <React.Fragment>
            {/* <h2>Личный кабинет</h2> */}
            <div className="cabinet-links">
                <Link to={`${match.path}`}>
                  <span className="cabinet-menu-button base-background-colour">Мероприятия</span>
                  </Link>
                <Link to={`${match.path}/users`}>
                  <span className="cabinet-menu-button base-background-colour">Пользователи</span>
                </Link>
            </div>

            <Switch>
                <Route exact path={match.path}>
                    <EditbleEventsList/>
                </Route>
                <Route path={`${match.path}/users`}>
                    <UserList/>
                </Route>
                {/* <Route path={`${match.path}/security`}>
                    <MySecurity />
                </Route> */}
            </Switch>
        </React.Fragment>
    )
}