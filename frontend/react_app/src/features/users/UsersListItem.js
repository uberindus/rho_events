import React from 'react'
import { Link, } from "react-router-dom";

export const UsersListItem = ({user}) => {
    return(
        <div className="users-list-item">
            <Link to={`/edit-user/${user.id}`}>
                <span>
                    {user.last_name + " "  + user.first_name + " " +
                        (user.patronymic ? user.patronymic : "")}
                </span>
                <span>-</span>
                <span>
                    {user.email}
                    </span>
                <span>-</span>
                <span>
                    {user.phone_number}
                </span>
            </Link>
        </div>
    )
} 