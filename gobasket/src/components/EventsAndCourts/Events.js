import React, {useEffect, useState, useCallback, useRef, useMemo} from "react";
import Mapbox from "../MapboxMap/Mapbox";

import CourtInfo from "./CourtInfo";
import EventInfo from "./EventInfo";

import { useCookies } from 'react-cookie';

import {animateScroll as scroll } from "react-scroll";


import useServer from "../../services/useServer";
// import useServerCourt from "../../services/useServerCourt";

import more from "../../resources/img/more.svg";

const { v4: uuidv4 } = require('uuid');

const Events = ({id}) => {
    // const cookies.userId = 'userid3'
    const [cookies, setCookie] = useCookies(['userId']);

    const {getAllEvents, getEventById, getOnlyIdSubs, getIdAndAdressOfCourts, editEvent, delEvent, subEvent, createEvent} = useServer()

    const [allEvents, setAllEvents] = useState([])  // все события
    const [courtsId, setCourtsId] = useState()  // индексы площадок
    const [infoEvent, setInfoEvent] = useState(null)    // информация о событии
    const [subsEventsId, setSubsEventsId] = useState(null)  // подписки пользователя
    const [newEventMode, setNewEventMode] = useState(false)  // новое событие

    const mobileVersion = useMemo(() => {
        if (window.innerWidth < 769) return true
        else return false
    })

    // const newEventMode = useRef(false)
    // const [infoAboutCourt, setInfoAboutCourt] = useState()
    // const [courtId, setCourtId] = useState(null)
    // const infoAboutCourt = useRef()

    // const formEditRef = useRef()
    // const formCreateRef = useRef()

    useEffect(() => {
        onRequest()

        document.addEventListener('keydown', handleEscPressed)
        return () => {
            document.removeEventListener('keydown', handleEscPressed)
        }
    }, [])

    const onRequest = () => {
        getAllEvents()  // все события
            .then(data => setAllEvents(data))
            .then(getOnlyIdSubs(cookies.userId)   // подписки пользователя
                .then(data => setSubsEventsId(data)))
            .then(getIdAndAdressOfCourts()  // адреса площадок
                .then(data => setCourtsId(data)))
    }

    function handleEscPressed(e) {
        if (e.keyCode == 27) {
            setInfoEvent(null)
        }
    }

    const getDateAndTime = (dateStr) => {
        const [date, time] = dateStr.split('T')

        const newDate = new Date(date)
        const month = newDate.toLocaleString('default', { month: 'long' }),
              day = newDate.getDate()

        return {
            day: `${month.toLocaleUpperCase()}, ${day}`,
            time: getLocalTime(time.slice(0, 5)),
            date: date
        }
    }
    const getLocalTime = (time) => {
        const hours = +(time.split(':')[0]) + 3
        return `${hours}:${time.split(':')[1]}`
    }

    const resetEvents = () => {
        setInfoEvent(null) 
        onRequest()
    }

    const closeInfoBar = () => {
        setInfoEvent(null) 
    }

    const subOnEvent = (e, eventId) => {
        e.preventDefault()

        const body = {
            "eventId": eventId,
            "userId": cookies.userId
        }

        subEvent(body).then(
            () => {
                getOnlyIdSubs(cookies.userId)
                    .then(data => setSubsEventsId(data))
                    .then(setInfoEvent(null))
                    .then(() => onRequest())
            }
        )
    }

    // новое событие
    const createNewEvent = (e, body) => {
        e.preventDefault()

        createEvent(body).then(() => { setInfoEvent(null); setNewEventMode(false); onRequest() })
    }

    // новое событие
    const addNewEvent = () => {
        setNewEventMode(true)
        setInfoEvent({"curent_id": 'lockId'})
    }
    
    // список событий
    const renderEventsList = useCallback((events) => {
        const handleEventClick = (eventId) => {
            setNewEventMode(false)
            getEventById(eventId).then(data => setInfoEvent(data))
        }

        const arr = events.map(event => {

            const {day, time} = getDateAndTime(event.time)

            return (
                <li key={event.id} onClick={() => handleEventClick(event.id)} className="events-list__item" id={event.id}>
                    <div className="events-list__item-adress">
                        {
                            mobileVersion ? event.adress.slice(0, 20) + '...' : event.adress
                        }
                    </div>
                    <div className="events-list__item-bottom">
                        <div className="events-list__item-day">
                            {day}
                        </div>
                        <div className="events-list__item-low">
                            <div className="events-list__item-time">
                                {time}
                            </div>
                            <div className="events-list__item-players">
                                {event.playersNow}/{event.playersAll}
                            </div>
                        </div>
                    </div>
                    <img className="events-list__item-more" src={more} alt="more" />
                </li>
            )
        })

        return arr
    }, [allEvents])

    const events = renderEventsList(allEvents)

    console.log('WIDTH: ', mobileVersion)

    return (
        <section className="events" >
            <h1 className="events-title title">События</h1>
            <div id={id} name={id} className="events-container container">
                <div className="events-content">
                    <div className="events-content__container">
                        {
                            cookies.userId ? 
                            <>
                                <ul className="events-content__container-list events-list">
                                    {events}
                                </ul>
                                <div className="events-content__container-add" onClick={() => addNewEvent()}>
                                    Добавить
                                </div>   
                            </> :
                            <div className="events-content__container-close">
                                Для просмотра актуальных событий необходимо авторизоваться
                            </div>

                        }

                    </div>
                    <Mapbox />
                    {
                        infoEvent ?
                        <EventInfo 
                            event={infoEvent} 
                            resetEvents={resetEvents} 
                            createNew={newEventMode} 
                            closeInfo={closeInfoBar}
                            subsEvent={subsEventsId}
                            subOnEvent={subOnEvent}
                            createNewEvent={createNewEvent}
                        />
                        :
                        null
                    }
                </div>
            </div>
        </section>
    )
}

export default Events;