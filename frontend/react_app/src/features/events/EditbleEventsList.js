import React, { useState } from 'react'

import { useGetEventsQuery, } from "../../api";
import { RequestFailedMessage } from "../general/RequestFailedMessage";
import { StatusFilters, useStatusFilters } from '../status/StatusFilters';

import { EditbleEventsListItem } from "./EditbleEventsListItem"

export const EditbleEventsList = ({userId}) => {
    const params = userId ? {user: userId} : null 
    const { data: events, isFetching, isSuccess, error } = useGetEventsQuery(params)

    const [statusFilter, setStatusFilter] = useState(null)

    const filteredEvents = statusFilter ?
            events.filter(event => event.status === statusFilter) : events

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
                <div className="public-events-list">
                    {filteredEvents.map(event =>
                        <EditbleEventsListItem
                            key={event.id}
                            event={event}
                        />
                    )}
                </div>
            </React.Fragment>
        )
    }
    else if (error){
        return <RequestFailedMessage message="Ошибка при загрузке мероприятий" error={error}/>
    }
    
}

    