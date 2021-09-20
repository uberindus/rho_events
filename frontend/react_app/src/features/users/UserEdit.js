import React from 'react'
import { useGetUserQuery, useUpdateUserMutation } from "../../api";

import { useSelector } from 'react-redux'
import { UserBasicInfoForm } from "./UserBasicInfoForm"
import { selectIsModerator, selectStatus } from "../auth/authSlice";

import { Avatar } from "../avatars/Avatar";
import { RequestFailedMessage } from "../general/RequestFailedMessage";
import { AffiliationsToUser } from "../affiliations/AffiliationsToUser";

import { StatusChangesTable,  } from "../status/StatusChangesTable";
import { StatusSubmitButtons  } from "../status/StatusSubmitButtons";

import { useGetUsersStatusChangesQuery } from "../../api"

export const UserEdit = ({userId}) => {
    const is_moderator = useSelector(state => selectIsModerator(state))
    const status = useSelector(state => selectStatus(state))

    const { data: user, error, isFetching, isSuccess } = useGetUserQuery(userId);

    const [updateUser, ] = useUpdateUserMutation()

    if (isFetching){
        return <div className="loader">Загрузка...</div>
    }
    else if (isSuccess){
        return (
            <div className="edit-user">
                    <div>
                        <Avatar avatarId={user.avatar}/>            
                    </div>
                    <div>
                        <h3 className="personal-data-header">Персональные данные</h3>
                        <UserBasicInfoForm user={user}/>
                    </div>
                    <div>
                        <h3 className="personal-data-header">Аффилиации</h3>
                        <AffiliationsToUser userId={userId}/>
                    </div>
                    <div>
                        <h3 className="personal-data-header">Статус</h3>
                        {/* вот здесь уже можно разместить историю изменения статусов с помощью таблицы */}
                        <StatusChangesTable
                            objectId={userId}
                            objectParamName="user"
                            useGetStatusChanges={useGetUsersStatusChangesQuery}
                        />
                        <StatusSubmitButtons 
                            is_moderator={is_moderator}
                            status={status}
                            updateObject={updateUser}
                            objectId={userId}
                        />
                    </div>
            </div>
            )
    }
    else if (error){
        return <RequestFailedMessage message="Ошибка при загрузке пользователя" error={error}/>
    }
}