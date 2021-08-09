import React from 'react'
import { useSelector } from 'react-redux'

import LoginForm from "./LoginForm"
import { selectIsLoggedIn } from "./authSlice"

import { useHistory } from 'react-router-dom';

export const Login = ({next}) => {

  const isLoggedIn = useSelector(selectIsLoggedIn)
  const history = useHistory();
  if (isLoggedIn){
    history.push(next ? next : "/"); 
    return null
  }
  else {
    return <LoginForm/>
  }
}
