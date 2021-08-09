import React from 'react'
import { getMyId } from '../../utils'
import { EditbleEventsList } from '../events/EditbleEventsList'

export const MyEvents = () => {
    return <EditbleEventsList userId={getMyId()}/>
}