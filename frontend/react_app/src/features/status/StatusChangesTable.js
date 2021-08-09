import React from 'react'
import { StatusCode } from "../../constants"

import Table from "react-bootstrap/Table"
import { useGetUserQuery } from "../../api";
import { RequestFailedMessage } from "../general/RequestFailedMessage";

import { StatusCode as StatusCodeConstants} from "../../constants";
import { DateTime } from "../general/Datetime";

// download all users in App.js
const StatusChangesTableRow = ({statusChange}) => {
    const { data: causer, error, isSuccess} = useGetUserQuery(statusChange.causer)
    if (isSuccess){
        return (
            <tr>
                <td></td>
                <td>{StatusCodeConstants[statusChange.previous_status]}</td>
                <td>{StatusCodeConstants[statusChange.current_status]}</td>
                <td><DateTime ISOtimestamp={statusChange.timestamp}/></td>
                <td className="col-md-3">
                    {`${causer.last_name} ${causer.first_name} ${causer.patdonymic}`}
                </td>
                <td className="col-md-4">{statusChange.comment}</td>
            </tr>
        )
    }
    else if (error){
        console.error("Error during fetchinh causer of status change", error)
        return <div></div>
    }
    else {
        return <div></div>
    }
}


export const StatusChangesTable = ({useGetStatusChanges, objectId, objectParamName}) => {
    const { data: statusChanges, error, isFetching, isSuccess} = useGetStatusChanges({[objectParamName]: objectId})
    if (isFetching){
        return <div className="loader">Загрузка...</div>
    }
    else if (isSuccess){
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>До</th>
                        <th>После</th>
                        <th>Дата</th>
                        <th>Изменил</th>
                        <th>Комментарий</th>
                    </tr>
                </thead>
                <tbody>
                    {statusChanges.map(obj => 
                        <StatusChangesTableRow statusChange={obj}/>
                    )}
                </tbody>
            </Table>
        )
    }
    else if (error){
        return <RequestFailedMessage message="Ошибка при записей изменения статуса" error={error}/>
    }
} 