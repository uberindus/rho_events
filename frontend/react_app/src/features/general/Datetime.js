import React from 'react'

export const DateTime = ({ ISOtimestamp }) => {
    if (ISOtimestamp) {
        var d = new Date(ISOtimestamp);
        var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
        d.getHours() + ":" + d.getMinutes();
        return (
            <span>
                &nbsp; <i>{datestring}</i>
            </span>
        )
    }
    else {
        return <span></span>
    }
}

export const DateInDMY = ({ date }) => {
    if (date) {
        var d = new Date(date);
        var datestring = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
        return (datestring)
    }
    else {
        return ""
    }
}
