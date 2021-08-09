import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
  } from '@reduxjs/toolkit'

import { getMyId } from '../../utils'
import { client } from '../../api/client'

const usersAdapter = createEntityAdapter()

export const fetchUser = createAsyncThunk('users/fetchUser', async (id, { rejectWithValue }) => {
    const res = await client.get(`api/users/${id}/`);
    if (res.ok) {
        return await res.json()
    }
    else if (res.status === 400){
        const errors = await res.json()
        return Promise.reject(rejectWithValue(errors))
    }
    
})

export const updateUser = createAsyncThunk('users/updateUser', async (userInfo, { rejectWithValue }) => {
    const res = await client.patch(`api/users/${userInfo.id}/`, userInfo);
    if (res.ok) {
        return await res.json()
    }
    else if (res.status === 400){
        const errors = await res.json()
        return Promise.reject(rejectWithValue(errors))
    }
})

const usersSlice = createSlice({
    name: 'users',
    initialState:  usersAdapter.getInitialState({
    }),
    extraReducers: {
        [fetchUser.fulfilled]: usersAdapter.addOne,
        [updateUser.fulfilled]: usersAdapter.upsertOne,
    }
})

export default usersSlice.reducer

export const {
    selectAll: selectUsers,
    selectById: selectUsersById,
} = usersAdapter.getSelectors((state) => state.users)

export const selectUserFetchingStatus = (state) => state.users.userFetchingStatus
export const selectUserFetchingError = (state) => state.users.userFetchingError