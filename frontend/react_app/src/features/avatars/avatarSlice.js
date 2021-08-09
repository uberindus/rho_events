import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
  } from '@reduxjs/toolkit'

import { client } from '../../api/client'

const avatarsAdapter = createEntityAdapter()

export const fetchAvatar = createAsyncThunk('avatars/fetchAvatar', async (id, { rejectWithValue }) => {
    const res = await client.get(`api/avatars/${id}/`);
    if (res.ok) {
        return await res.json()
    }
    else if (res.status === 400){
        const errors = await res.json()
        return Promise.reject(rejectWithValue(errors))
    }
    
})

export const updateAvatar = createAsyncThunk('avatars/updateAvatar', async (obj, { rejectWithValue }) => {
    const res = await client.patch(`api/avatars/${obj.id}/`, obj);
    if (res.ok) {
        return await res.json()
    }
    else if (res.status === 400){
        const errors = await res.json()
        return Promise.reject(rejectWithValue(errors))
    }
})

const avatarsSlice = createSlice({
    name: 'avatars',
    initialState:  avatarsAdapter.getInitialState({
    }),
    extraReducers: {
        [fetchAvatar.fulfilled]: avatarsAdapter.addOne,
        [updateAvatar.fulfilled]: avatarsAdapter.upsertOne
    }
})


export default avatarsSlice.reducer

export const {
    selectAll: selectAvatars,
    selectById: selectAvatarsById,
} = avatarsAdapter.getSelectors((state) => state.avatars)

export const selectUserAvatar = (state, userId) => state.avatars.find((ava => ava.user === userId))