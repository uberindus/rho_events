import React from 'react'
import { AffiliationToUserListItem } from "./AffiliationToUserListItem"

export const AffiliationsToUserList = ({affiliations, organizations, deleteAffiliation, updateAffiliation}) => {
    return(
        affiliations.map(affiliation =>
            <AffiliationToUserListItem
                affiliation={affiliation}
                organization={organizations[affiliation.organization]}
                deleteAffiliation={deleteAffiliation}
                updateAffiliation={updateAffiliation}
            />
        )
    )
} 