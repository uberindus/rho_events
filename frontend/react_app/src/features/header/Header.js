import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectIsLoggedIn, logout } from "../auth/authSlice";


const Authblock = (props) => {

  const dispatch = useDispatch()

  if (props.isLoggedIn === false) {
    return(
      <React.Fragment>
        <div>
          <Link to="/signup">Регистрация</Link>
        </div>
        <div>
          <Link to="/login">Вход</Link>
        </div>
      </React.Fragment>
    )
  }
  else {
    return (
      <div>
          <Link onClick={() => dispatch(logout())} to="/">Выход</Link>
      </div>
    )
  }
}

export const Header = () => {

  const isLoggedIn = useSelector(selectIsLoggedIn)
  const is_moderator = useSelector(state => state.auth.is_moderator)

  return (
        <div>
            <div className="navbar-head">   
                <div className="navbar-logo">
                    <img src="img/mendeleev.png"/>
                </div>
                  <div className="auth-block">
                      <Authblock isLoggedIn={isLoggedIn}/>
                  </div>
            </div>
            <div className="navbar-menu">
                <Link to="/public-events">
                  <span className="navbar-menu-button base-background-colour">Мероприятия</span>
                  </Link>
                <Link to={isLoggedIn ? "/cabinet" : "/login"}>
                  <span className="navbar-menu-button base-background-colour">Личный кабинет</span>
                </Link>
                {is_moderator ? 
                  <Link to="/moderation">
                    <span className="navbar-menu-button base-background-colour">Панель модератора</span>
                  </Link>
                  :
                  null
                }
            </div>
        </div>
    )
}

// <div className="navbar-menu">
//                 <div className="navbar-menu-button">
//                 </div>
//                 <div className="navbar-menu-button">
//                 </div>
// </div>