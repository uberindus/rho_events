import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SignUpForm from "./SignUpForm"
import { selectIsLoggedIn, selectSignUpStatus, login } from "./authSlice"

import { getMyId } from "../../utils"
import { UserEdit } from "../users/UserEdit"


export const SignUp = () => {

  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useDispatch()

  if (isLoggedIn){
    return <UserEdit userId={getMyId()}/>
  }
  else {
    return <SignUpForm/>
  }
}
