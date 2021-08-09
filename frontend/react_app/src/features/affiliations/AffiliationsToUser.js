import React from 'react'
import { normalizeData } from "../../utils"

import {useGetAffiliationsQuery,
        useUpdateAffiliationMutation,
        useDeleteAffiliationMutation,
        useGetOrganizationsQuery,
        } from "../../api";

import { AffiliationsToUserList } from "./AffiliationsToUserList";
import { AddAffiliationToUser } from "./AddAffiliationToUser";
import { RequestFailedMessage } from "../general/RequestFailedMessage";

export const AffiliationsToUser = ({userId}) => {
    const { data: affiliations,
        isFetching: isAffiliationsFetching,
        isSuccess: isAffiliationsSuccess,
        error: affiliationsError, } = useGetAffiliationsQuery({user: userId})

    const { data: organizations,
            isFetching: isOrganizationsFetching,
            isSuccess: isOrganizationsSuccess } = useGetOrganizationsQuery()
    
    const [ updateAffiliation, ] = useUpdateAffiliationMutation()
    const [ deleteAffiliation,] = useDeleteAffiliationMutation()

    if (isAffiliationsFetching || isOrganizationsFetching){
        return <div>Загрузка...</div>
    }
    else if (isAffiliationsSuccess && isOrganizationsSuccess){
        return(
            <React.Fragment>
                <AffiliationsToUserList
                    affiliations={affiliations}
                    organizations={normalizeData(organizations)}
                    updateAffiliation={updateAffiliation}
                    deleteAffiliation={deleteAffiliation}
                />
                <AddAffiliationToUser userId={userId} organizations={organizations}/>
            </React.Fragment>
        )
    }
    else if (affiliationsError){
        return <RequestFailedMessage message="Ошибка при загрузке аффилиаций пользователя" error={affiliationsError}/>
    }
    
}

    