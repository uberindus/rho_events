import React from 'react'
import { normalizeData } from "../../utils"
import { UserObjectsList } from "./UserObjectsList"
import { AddObjectToUser } from "./AddObjectToUser"

// objects has relation many to many with user via joinObjects.
// foreignKeyToObject is name in joinObjects of foreign key to objects  

export const SimpleManyToUsers = ({
    userId, objects, joinObjects, foreignKeyToObject, deleteJoinObject, addJoinObject}) => {
    
    objects = normalizeData(objects)

    return(
        <React.Fragment>
        <div className='user-items-list'>
            <UserObjectsList
                joinObjects={joinObjects}
                objects={objects}
                foreignKeyToObject={foreignKeyToObject}
                deleteJoinObject={deleteJoinObject}
            />
            <AddObjectToUser
                userId={userId}
                objects={objects}
                foreignKeyToObject={foreignKeyToObject}
                addJoinObject={addJoinObject}
            />
        </div>
        </React.Fragment>
    )
} 
