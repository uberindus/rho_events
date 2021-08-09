import React from 'react'
import { useGetEventQuery } from '../../api'
import { dateToDMY } from '../../utils'
import { RequestFailedMessage } from '../general/RequestFailedMessage'

export const PublicEvent = ({eventId}) => {

  const {data: event, error, isFetching, isSuccess} = useGetEventQuery(eventId)

  if (isFetching){
    return <div>Загрузка...</div>
  }
  else if (isSuccess){
    return (
      <div className="public-event">
        <h2>{event.title}</h2>
        <div className="piblic-event-dates">
          <span>{dateToDMY(Date(event.date_begin))}</span>
          <span>-</span>
          <span>{dateToDMY(Date(event.date_end))}</span>
        </div>
        <div className="public-event-full-description">
          {event.full_description}
        </div>
        <div className="public-event-place">
          <span><b>Место проведения</b> -</span>
          <span> </span>
          <span>{event.place}</span>
        </div>
      </div>
    )
  }
  else if (error){
    return <RequestFailedMessage message="Ошибка при загрузке мероприятия" error={error}/>
  }
}