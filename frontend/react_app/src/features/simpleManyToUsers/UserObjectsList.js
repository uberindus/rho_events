import React from 'react'
import { UserObjectsListItem } from "./UserObjectsListItem"

export const UserObjectsList = ({joinObjects, objects, foreignKeyToObject, deleteJoinObject}) => {
    return(

        joinObjects.map(joinObj =>
            <UserObjectsListItem
                joinId={joinObj.id}
                object={objects[joinObj[foreignKeyToObject]]}
                deleteJoinObject={deleteJoinObject}
            />
        )
    )
} 