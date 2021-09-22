import {useState} from 'react'

const StatusFilter = ({statusFilter, setStatusFilter, text, value}) => 
    <a
        style={{
            "color": (value === statusFilter ? "#df5d43" : "#0d6efd"),
            "cursor": "pointer",
        }}
        onClick={() => setStatusFilter(value)}
    >
        {text}
    </a>

export const StatusFilters = ({statusFilter, setStatusFilter}) => {
    
    const filters = [
        {text: "Одобренные", value: "APPROVED" },
        {text: "На рассмотрении", value: "PROCESS" },
        {text: "Черновики", value: "DRAFT" },
        {text: "Отклоненные", value: "REJECTED" },
        {text: "Отправленные на доработку" , value: "RETURNED" },
    ]

    return(
        <div className="filters">
            <span>Фильтры: </span>
            {filters.map(filter => 
                <StatusFilter
                    setStatusFilter={setStatusFilter}
                    statusFilter={statusFilter}
                    key={filter.value}
                    text={filter.text}
                    value={filter.value}
                />
            )}
        </div>
    )
}

export const useStatusFilters = () => {
    const [statusFilter, setStatusFilter] = useState(null)
    
    return(
        [statusFilter,
        <StatusFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>]
    )
}