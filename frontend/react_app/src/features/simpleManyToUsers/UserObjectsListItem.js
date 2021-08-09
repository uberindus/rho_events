import React from 'react'
import Form from "react-bootstrap/Form"

export const UserObjectsListItem = ({joinId, object, deleteJoinObject}) => {
    return(
        <React.Fragment>
            <span className="user-item">
                {/* field name is hardcoded */}
                <span>{object.title}</span>
                <button
                    onClick={() => deleteJoinObject(joinId)}
                    className="delete-user-item muted-button">
                        ❌
                </button>
            </span>
        </React.Fragment>
    )
} 