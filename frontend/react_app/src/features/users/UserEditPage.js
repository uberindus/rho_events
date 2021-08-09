import React from 'react'
import { useParams } from 'react-router'
import { UserEdit } from './UserEdit'


export const UserEditPage = () => {
    const { id: userId } = useParams()    
    return <UserEdit userId={userId}/>
}

