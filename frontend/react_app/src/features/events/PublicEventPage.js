import React from 'react'
import { useParams } from 'react-router'
import { PublicEvent } from './PublicEvent'

export const PublicEventPage = () => {
    const { id: eventId } = useParams()    
    return <PublicEvent eventId={eventId}/>
}