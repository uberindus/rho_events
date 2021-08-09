import React from 'react'
import { EventOrganizationsListItem } from "./EventOrganizationsListItem"

export const EventOrganizationsList = ({eventOrganizations, organizations, updateEventOrganization, deleteEventOrganization}) => {
    return(
        eventOrganizations.map(eventOrganization =>
            <EventOrganizationsListItem
                eventOrganization={eventOrganization}
                organization={organizations[eventOrganization.organization]}
                deleteEventOrganization={deleteEventOrganization}
                updateEventOrganization={updateEventOrganization}
            />
        )
    )
} 