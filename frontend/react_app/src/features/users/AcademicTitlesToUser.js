import React from 'react'
import { useGetAcademicTitlesUsersQuery, useGetAcademicTitlesQuery,
        useAddAcademicTitlesUsersMutation, useDeleteAcademicTitlesUserMutation, } from "../../api";
import { SimpleManyToUsers } from "../simpleManyToUsers/SimpleManyToUsers"
import { RequestFailedMessage } from "../general/RequestFailedMessage";

export const AcademicTitlesToUser = ({userId}) => {
    
    const { data: proffInterests,
            isFetching: isAcademicTitlesFetching,
            isSuccess: isAcademicTitlesSuccess } = useGetAcademicTitlesQuery()
    const { data: proffInterestsUsers,
            error: AcademicTitlesUsersError,
            isFetching: isAcademicTitlesUsersFetching,
            isSuccess: isAcademicTitlesUsersSuccess } = useGetAcademicTitlesUsersQuery({user: userId})

    const [ AddAcademicTitlesUser, ] = useAddAcademicTitlesUsersMutation()
    const [ DeleteAcademicTitlesUser,] = useDeleteAcademicTitlesUserMutation()

    if (isAcademicTitlesFetching || isAcademicTitlesUsersFetching){
        return <div>Загрузка...</div>
    }
    else if (isAcademicTitlesSuccess && isAcademicTitlesUsersSuccess){
        return(
            <React.Fragment>
                <div>Академические титулы</div>
                <SimpleManyToUsers
                    objects={proffInterests}
                    joinObjects={proffInterestsUsers}
                    foreignKeyToObject="academic_title"
                    deleteJoinObject={DeleteAcademicTitlesUser}
                    addJoinObject={AddAcademicTitlesUser}
                />
            </React.Fragment>
        )
    }
    else if (AcademicTitlesUsersError){
        return <RequestFailedMessage message="Ошибка при загрузке академических титулов пользователя" error={AcademicTitlesUsersError}/>
    }
} 
