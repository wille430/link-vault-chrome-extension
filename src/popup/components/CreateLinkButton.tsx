import { useEffect } from 'react'
import { BsPlus } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router'

export const CreateLinkButton = () => {
    const navigate = useNavigate()
    const { colId } = useParams()

    const handleClick = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        if (!tab.id || !tab.url) return

        navigate(`/${colId}/new`, {
            state: {
                url: tab.url,
                title: tab.title,
            },
        })
    }

    return (
        <button className='btn btn-primary container' onClick={handleClick}>
            <BsPlus />
        </button>
    )
}
