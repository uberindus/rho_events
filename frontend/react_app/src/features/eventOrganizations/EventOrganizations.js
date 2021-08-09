import React from 'react'
import { normalizeData } from "../../utils"

import {useGetEventOrganizationsQuery,
        useUpdateEventOrganizationMutation,
        useDeleteEventOrganizationMutation,
        useGetOrganizationsQuery,
        } from "../../api";

import { EventOrganizationsList } from "./EventOrganizationsList";
import { AddEventOrganizationToEvent } from "./AddEventOrganizationToEvent";
import { RequestFailedMessage } from "../general/RequestFailedMessage";

export const EventOrganizations = ({eventId}) => {
    const { data: eventOrganizations,
        isFetching: isEventOrganizationsFetching,
        isSuccess: isEventOrganizationsSuccess,
        error: eventOrganizationError, } = useGetEventOrganizationsQuery({event: eventId})

    const { data: organizations,
            isFetching: isOrganizationsFetching,
            isSuccess: isOrganizationsSuccess } = useGetOrganizationsQuery()
    
    const [ updateEventOrganization, ] = useUpdateEventOrganizationMutation()
    const [ deleteEventOrganization,] = useDeleteEventOrganizationMutation()

    if (isEventOrganizationsFetching || isOrganizationsFetching){
        return <div>Загрузка...</div>
    }
    else if (isEventOrganizationsSuccess && isOrganizationsSuccess){
        return(
            <React.Fragment>
                <EventOrganizationsList
                    eventOrganizations={eventOrganizations}
                    organizations={normalizeData(organizations)}
                    updateEventOrganization={updateEventOrganization}
                    deleteEventOrganization={deleteEventOrganization}
                />
                <AddEventOrganizationToEvent eventId={eventId} organizations={organizations}/>
            </React.Fragment>
        )
    }
    else if (eventOrganizationError){
        return <RequestFailedMessage message="Ошибка при загрузке аффилиаций пользователя" error={eventOrganizationError}/>
    }
    
}

    