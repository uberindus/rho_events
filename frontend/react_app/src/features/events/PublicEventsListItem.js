import React from 'react'
import { Link, } from "react-router-dom";
import { dateToDMY } from '../../utils';

export const PublicEventsListItem = ({event}) => {
    return(
        <div className="events-list-item">
            <h5><Link to={`/public-events/${event.id}`}>{event.title}</Link></h5>
            <div className="events-list-item-dates">
                <span>Дата начала: {dateToDMY(event.date_begin)}</span>
                <span>Дата конца: {dateToDMY(event.date_end)}</span>
            </div>
            <div className="events-list-item-brief_description">{event.brief_description}</div>
        </div>
    )
} 
