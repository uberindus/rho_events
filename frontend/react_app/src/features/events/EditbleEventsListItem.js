import React from 'react'
import { Link, } from "react-router-dom";
import { dateToDMY } from '../../utils';

export const EditbleEventsListItem = ({event}) => {
    return(
        <div className="events-list-item">
            <h5><Link to={`/edit-event/${event.id}`}>{event.title}</Link></h5>
            <div className="events-list-item-dates">
                    <span>Дата начала: {dateToDMY(Date(event.date_begin))}</span>
                    <span>Дата конца: {dateToDMY(Date(event.date_end))}</span>
            </div>
            <div className="events-list-item-brief_description">{event.brief_description}</div>
        </div>
    )
} 