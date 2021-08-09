import React from 'react'
import { useParams } from 'react-router'
import { useGetEventQuery, useGetEventsStatusChangesQuery, useUpdateEventMutation } from '../../api'
import { StatusChangesTable } from '../status/StatusChangesTable'
import { StatusSubmitButtons } from '../status/StatusSubmitButtons'


import { useSelector } from 'react-redux'
import { selectIsModerator} from "../auth/authSlice";
import { RequestFailedMessage } from '../general/RequestFailedMessage'
import { EventBasicInfoForm } from './EventBasicInfoForm'
import { EventOrganizations } from "../eventOrganizations/EventOrganizations";

export const EventEdit = () => {
    
    const { id: eventId } = useParams()    

    const is_moderator = useSelector(state => selectIsModerator(state))
    const { data: event, error, isFetching, isSuccess } = useGetEventQuery(eventId);
    const [updateEvent, ] = useUpdateEventMutation()

    if (isFetching){
        return <div className="loader">Загрузка...</div>
    }
    else if (isSuccess){
        return (
            <div className="edit-event">
                    <div>
                        <h3 className="personal-data-header">Общая информация</h3>
                        <EventBasicInfoForm event={event}/>
                    </div>
                    <div>
                        <h3 className="personal-data-header">Организации ответственные за мероприятие</h3>
                        <EventOrganizations eventId={event.id}/>
                    </div>
                    <div>
                        <h3 className="personal-data-header">Статус мероприятия</h3>
                        <StatusChangesTable
                            objectId={event.id}
                            objectParamName="event"
                            useGetStatusChanges={useGetEventsStatusChangesQuery}
                        />
                        <StatusSubmitButtons 
                            is_moderator={is_moderator}
                            status={event.status}
                            updateObject={updateEvent}
                            objectId={event.id}
                        />
                    </div>
            </div>
        )
    }
    else if (error){
        return <RequestFailedMessage message="Ошибка при загрузке мероприятия" error={error}/>
    }
}