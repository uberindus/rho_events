import React from 'react'
import { useGetAvatarQuery} from "../../api";
import { EditAvatar } from "./EditAvatar";
import { RequestFailedMessage } from "../general/RequestFailedMessage"

import { Row, Col, InputGroup } from "react-bootstrap";

export const Avatar = ({avatarId}) => {
    
    const { data: avatar, error, isFetching, isSuccess } = useGetAvatarQuery(avatarId);

    const photo = avatar ? avatar.photo: null
    if (isFetching || isSuccess){
        return (
            <React.Fragment>
                <div className="avatar-zone row justify-content-md-center">
                    <div className="avatar">
                        <img src={photo ? photo : "img/no_avatar.png"}/>
                        <EditAvatar avatarId={avatarId}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    else if (error){
        return <RequestFailedMessage message="Ошибка при загрузке аватара" error={error}/>
    }
}
