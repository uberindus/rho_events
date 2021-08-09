import React from 'react'

export const EventList = ({events, EventsListItem}) => {
    return(
        events.map(event =>
            <EventsListItem
                key={event.id}
                event={event}
            />
        )
    )
} 