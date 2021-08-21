import React from 'react'
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
  } from "react-router-dom";
import { UserEdit } from "../users/UserEdit";
import { getMyId } from "../../utils"
import { MyEvents } from './MyEvents';
import { MySecurity } from './MySecurity';

export const Cabinet = () => {
    let match = useRouteMatch();
    return(
        <React.Fragment>
            {/* <h2>Личный кабинет</h2> */}
            <div className="cabinet-links">
                <Link to={`${match.path}`}>
                  <span className="cabinet-menu-button base-background-colour">Профиль</span>
                  </Link>
                <Link to={`${match.path}/my-events`}>
                  <span className="cabinet-menu-button base-background-colour">Мои мероприятия</span>
                </Link>
                <Link to={`${match.path}/security`}>
                  <span className="cabinet-menu-button base-background-colour">Настройки безопасности</span>
                </Link>
            </div>

            <Switch>
                <Route exact path={match.path}>
                    <UserEdit userId={getMyId()}/>
                </Route>
                <Route path={`${match.path}/my-events`}>
                    <MyEvents />
                </Route>
                <Route path={`${match.path}/security`}>
                    <MySecurity />
                </Route>
            </Switch>
        </React.Fragment>
    )
}