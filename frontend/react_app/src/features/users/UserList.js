import React, { useState } from 'react'

import { useGetUsersQuery, } from "../../api";
import { RequestFailedMessage } from "../general/RequestFailedMessage";
import { StatusFilters } from '../status/StatusFilters';
import { UsersListItem } from './UsersListItem';

export const UserList = () => {
    const { data: users, isFetching, isSuccess, error } = useGetUsersQuery()

    const [statusFilter, setStatusFilter] = useState(null)

    const filteredUsers = statusFilter ?
            users.filter(users => users.status === statusFilter) : users

    if (isFetching){
        return <div>Загрузка...</div>
    }
    else if (isSuccess){
        return(
            <React.Fragment>
                <StatusFilters 
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
                <div className="users-list">
                    {filteredUsers.map(user =>
                        <UsersListItem
                            key={user.id}
                            user={user}
                        />
                    )}
                </div>
            </React.Fragment>
        )
    }
    else if (error){
        return <RequestFailedMessage message="Ошибка при загрузке пользователей" error={error}/>
    }
    
}

    