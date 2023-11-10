import React, {useCallback} from "react";

const useServer = () => {
    
    const onRequest = useCallback(async (url, method="GET", body=null, headers = {}) => {
        try {
            const response = await fetch(url, {method, body, headers})
        
            if (!response.ok) {
                throw new Error(`Could not fetch status: ${response.url}`);
            }

            const data = await response.json()

            return data
        } catch(e) {
            throw e;
        }
    })

    // все события
    const getAllEvents = async () => {
        const { events, _ } = await onRequest("http://localhost:3001/events/")

        return events
    }

    // событие по ID
    const getEventById = async (id) => {
        const { event, _ } = await onRequest(`http://localhost:3001/events/${id}`)

        return event[0]
    }

    // события пользователя (!!!ТОЛЬКО ID!!!)
    const getOnlyIdSubs = async (userId) => {
        const { eventsId, _ } = await onRequest(`http://localhost:3001/subeventbyuser/user/id/${userId}`)

        return eventsId.map(item => item.event_id)
    }

    // айди и адреса площадок
    const getIdAndAdressOfCourts = async () => {
        const {courts, _} = await onRequest('http://localhost:3001/courts/all')
    
        return courts
    }

    // изменение события
    const editEvent = async (body) => {
        const update = await onRequest('http://localhost:3001/events', 'PUT', JSON.stringify(body), {
            "Content-Type": "application/json"
        })
    }

    // отмена подписки на событие (с его удалением)
    const delEvent = async (body) => {
        const del = await onRequest('http://localhost:3001/subeventbyuser/', 'DELETE', JSON.stringify(body), {
            "Content-Type": "application/json"
        })
    }

    // подписка на событие
    const subEvent = async (body) => {
        const sub = await onRequest('http://localhost:3001/subeventbyuser/', 'POST', JSON.stringify(body), {
            "Content-Type": "application/json"
        })
    }

    const getSubsUser = async (userId) => {
        const data = await onRequest(`http://localhost:3001/subeventbyuser/user/${userId}`)

        return data.events

    }

    // новое событие
    const createEvent = async (body) => {
        const {eventId, creator: userId } = body

        await onRequest('http://localhost:3001/events/', 'POST', JSON.stringify(body), {
            "Content-Type": "application/json"
        })

        const newBody = {eventId, userId}

        await subEvent(newBody)
    }


    return {getAllEvents, getEventById, getOnlyIdSubs, getIdAndAdressOfCourts, editEvent, delEvent, subEvent, createEvent, getSubsUser}


}

export default useServer