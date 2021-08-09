import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
  } from '@reduxjs/toolkit'

import { client } from '../../api/client'
import { auth_tokenKey, myIdKey } from "../../constants" 

export const signUp = createAsyncThunk('auth/signUp', async (userInfo, { rejectWithValue }) => {
    const res = await client.post('api/users/', userInfo);
    if (res.ok){
        return res
    }
    else if (res.status === 400 ){
        const errors = await res.json()
        return Promise.reject(rejectWithValue(errors))
    }   
})

export const logout = createAsyncThunk('auth/logout', async () => {
    try{
        await client.post('api/token/logout');
    }
    catch(err){
        console.error(err)
    }
    finally{
        localStorage.clear()
    }
})

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    const res = await client.post('api/token/login/', credentials)
    if (res.ok) {
        let data = await res.json()
        localStorage.setItem(auth_tokenKey, data.auth_token)
        localStorage.setItem(myIdKey, data.user)
        const is_moderator = data.is_moderator === "True" ? true : false
        localStorage.setItem("is_moderator", is_moderator)
        localStorage.setItem("status", data.status)
        return data
    }
    else if (res.status === 400){
        const errors = await res.json()
        return Promise.reject(rejectWithValue(errors))
    }
})

// Сделать thunk logIn

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: localStorage.getItem("myId") && localStorage.getItem("auth_token") ?  true : false,
        is_moderator :  localStorage.getItem("is_moderator") === 'true' ? true : false,
        status : localStorage.getItem("status"),
    },
    reducers: {},
    extraReducers: {
        [signUp.fulfilled]: (state, action) => {
            state.signUpStatus = "succeeded"
        },
        [logout.pending]: (state, action) => {
            state.isLoggedIn = false
            state.is_moderator = null
            state.status = null
        },
        [login.fulfilled]: (state, action) => {
            state.isLoggedIn = true
            state.status = action.payload.status
            const is_moderator = action.payload.is_moderator === "True" ? true : false
            state.is_moderator = is_moderator
        },
    }
    
})
  
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectLogginStatus = (state) => state.auth.logginStatus
export const selectIsModerator = (state) => state.auth.is_moderator
export const selectSignUpStatus = (state) => state.auth.signUpStatus
export const selectSignUpErrors = (state) => state.auth.signUpErrors
export const selectStatus = (state) => state.auth.status
export default authSlice.reducer
  