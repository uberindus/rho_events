import React from 'react'
import { useSelector } from "react-redux";

import { Link, } from "react-router-dom";
import { useGetEventsQuery, } from "../../api";
import { RequestFailedMessage } from "../general/RequestFailedMessage";

import { EventList } from "./EventList";
import { PublicEventsListItem } from "./PublicEventsListItem"

export const PublicEventsList = () => {
    const { data: events, isFetching, isSuccess, error } = useGetEventsQuery({status: "APPROVED"})

    const status = useSelector(state => state.auth.status)

    if (isFetching){
        return <div>Загрузка...</div>
    }
    else if (isSuccess){
        return(
            <React.Fragment>
                <h3 className="content-header">Мероприятия</h3>
                {status === "APPROVED" ? 
                    <div className="add-event-link">
                        <Link to="/add-event">
                            <span className="add-event-button base-background-colour">Добавить мероприятие</span>
                        </Link>
                    </div>
                    :
                    null
                }
                <div className="public-events-list">
                    {events.map(event =>
                        <PublicEventsListItem
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

    