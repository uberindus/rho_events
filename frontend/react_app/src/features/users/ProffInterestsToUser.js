import React from 'react'
import { useGetProffInterestsUsersQuery, useGetProffInterestsQuery,
        useAddProffInterestsUsersMutation, useDeleteProffInterestsUserMutation, } from "../../api";
import { SimpleManyToUsers } from "../simpleManyToUsers/SimpleManyToUsers"
import { RequestFailedMessage } from "../general/RequestFailedMessage";

export const ProffInterestsToUser = ({userId}) => {
    
    const { data: proffInterests,
            isFetching: isProffInterestsFetching,
            isSuccess: isProffInterestsSuccess } = useGetProffInterestsQuery()
    const { data: proffInterestsUsers,
            error: ProffInterestsUsersError,
            isFetching: isProffInterestsUsersFetching,
            isSuccess: isProffInterestsUsersSuccess } = useGetProffInterestsUsersQuery({user: userId})

    const [ AddProffInterestsUser, ] = useAddProffInterestsUsersMutation()
    const [ DeleteProffInterestsUser,] = useDeleteProffInterestsUserMutation()

    if (isProffInterestsFetching || isProffInterestsUsersFetching){
        return <div>Загрузка...</div>
    }
    else if (isProffInterestsSuccess && isProffInterestsUsersSuccess){
        return(
            <React.Fragment>
                <div>Профессиональные интересы</div>
                <SimpleManyToUsers
                    objects={proffInterests}
                    joinObjects={proffInterestsUsers}
                    foreignKeyToObject="proff_interest"
                    deleteJoinObject={DeleteProffInterestsUser}
                    addJoinObject={AddProffInterestsUser}
                />
            </React.Fragment>
        )
    }
    else if (ProffInterestsUsersError){
        return <RequestFailedMessage message="Ошибка при загрузке профессиональных интересов пользователя" error={ProffInterestsUsersError}/>
    }
} 
