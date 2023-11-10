import React, {useEffect, useRef, useState } from "react";

import useServer from "../../services/useServer";
import useServerCourt from "../../services/useServerCourt";

import { useCookies } from 'react-cookie';

import CourtInfo from "./CourtInfo";


const { v4: uuidv4 } = require('uuid');

const EventInfo = ({event, resetEvents, createNew, closeInfo, subsEvent, subOnEvent, createNewEvent}) => {
    // const cookies.userId = 'userid3'
    const [cookies, setCookie] = useCookies(['userId']);

    const {getOnlyIdSubs, getIdAndAdressOfCourts, editEvent, delEvent, createEvent} = useServer()
    const {getDescrAndImages} = useServerCourt()

    // const [subsEventsId, setSubsEventsId] = useState(null)  // подписки пользователя

    const [courtsId, setCourtsId] = useState()  // индексы площадок

    const [courtInfo, setCourtInfo] = useState()

    const [idCourt, setIdCourt] = useState()
    
    // const infoAboutCourt = useRef()
    const formEditRef = useRef()
    const formCreateRef = useRef()

    useEffect(() => {
        onRequest()
    }, [])

    useEffect(() => {
        if (idCourt) {
            getDescrAndImages(idCourt).then(data => setCourtInfo(data))
        }
    }, [idCourt])

    const onRequest = () => {
        getIdAndAdressOfCourts().then(data => setCourtsId(data))
        .then(() =>
            { getDescrAndImages(event.court_id).then(data => setCourtInfo(data)) }
        )
    }

    // дата
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
        // if (createNew) return
        const hours = +(time.split(':')[0])
        return `${hours}:${time.split(':')[1]}`
    }
    
    // изменение события
    const handleSumbit = (e, eventId) => {
        e.preventDefault()

        const body = {
            "event_id": eventId,
            "time": `${formEditRef.current.elements.date.value} ${getLocalTime(formEditRef.current.elements.time.value)}`,
            "players_num": formEditRef.current.elements.playersAll.value,
            "description": formEditRef.current.elements.about.value,   
            "court_id": formEditRef.current.elements.adress.value
        }
        editEvent(body).then(() => resetEvents())
    }
    
    // удаление события или подписки
    const handleDeleteClick = (e, eventId) => {
        e.preventDefault()

        const body = {
            "eventId": eventId,
            "userId": cookies.userId
        }

        delEvent(body).then(() => resetEvents())
    }

    // новое событие
    const handleSumbitForNew = (e) => {
        e.preventDefault()

        const body = {
            "eventId": uuidv4().toString().slice(0, 11),
            "time": `${ formCreateRef.current.elements.date.value} ${getLocalTime(formCreateRef.current.elements.time.value)}`,
            "playersNum": formCreateRef.current.elements.playersAll.value,
            "descr": formCreateRef.current.elements.about.value,   
            "courtId": formCreateRef.current.elements.adress.value,
            "creator": cookies.userId
        }

        createEvent(body).then(() => resetEvents())
    }

    // изменение площадки
    const handleChangeCourt = (e) => {
        console.log('HANDLE CHANGE COURT: ', e.target.value)
        setIdCourt(e.target.value)
    }

    // все площадки (выбор через селект)
    const createSelectWithCourts = (courts, curAdres = null) => {
        if (courts) {
            const arr = courts.map((item, i) => {
                if (item.adress == curAdres) {
                    return (
                        <option key={i} value={item.court_id} selected>
                            {item.adress}
                        </option>
                    )
                }
                return (
                    <option key={i} value={item.court_id}>
                        {item.adress}
                    </option>
                )
            })
    
            return (
                <select onChange={(e) => {handleChangeCourt(e)}} name="adress">
                    {arr}
                </select>
            )
        }

    }

    let obj = {day: '', time: '', date: ''}
    if (!createNew) {
        obj = getDateAndTime(event.time)
    }


    
    let courts = createSelectWithCourts(courtsId)

    console.log('BLYAT')
    console.log(obj)

    return (
        <>
            {
                createNew ?
                <div className="eventinfo">
                    <form method="POST" ref={formCreateRef} onSubmit={(e) => handleSumbitForNew(e, event.event_id)} className="eventinfo-event">
                        <div style={{display:"flex", flexDirection: "column"}}>
                            <label htmlFor="adress">
                                Адрес: {courts}
                            </label>
                            <label htmlFor="date">
                                Дата: <input name="date" type="date" required></input>
                            </label>
                            <label htmlFor="time">
                                Время: <input name="time" type="time" required></input>
                            </label>
                            <label htmlFor="playersAll">
                                Нужно игроков: <input name="playersAll" required type="number" min={2}></input>
                            </label>
                            <label htmlFor="about">
                                О событии: 
                                <textarea name="about"></textarea>
                            </label>
                        </div>

                        <input type="submit" value="СОЗДАТЬ"></input>
                    </form>
                    <CourtInfo courtInfo={courtInfo}/>
                    <div className="eventinfo__close" onClick={() => closeInfo()}></div>
                </div> :
                event.creator == cookies.userId ? 
                <div className="eventinfo">
                    <form method="PUT" ref={formEditRef} onSubmit={(e) => handleSumbit(e, event.event_id)} className="eventinfo-event">
                        <div style={{display:"flex", flexDirection: "column"}}>
                            <label htmlFor="adress">
                                Адрес: {courts}
                            </label>
                            <label htmlFor="date">
                                Дата: <input name="date" type="date" defaultValue={obj.date}></input>
                            </label>
                            <label htmlFor="time">
                                Время: <input name="time" type="time" defaultValue={obj.time}></input>
                            </label>
                            <label htmlFor="playersAll">
                                Нужно игроков: <input name="playersAll" type="number" min={event.playersNow} defaultValue={event.playersAll}></input>
                            </label>
                            <label htmlFor="about">
                                О событии: 
                                <textarea name="about" defaultValue={event.eventDescr}></textarea>
                            </label>
                        </div>
                        <div className="row" style={{alignItems: "center"}}>
                            <input type="submit" value="ИЗМЕНИТЬ"></input>
                            <div className="eventinfo__delete" onClick={(e) => handleDeleteClick(e, event.event_id)}>УДАЛИТЬ</div>
                        </div>
                    </form>
                    <CourtInfo courtInfo={courtInfo}/>
                    <div className="eventinfo__close" onClick={() => closeInfo()}></div>
                </div> :
                <div className="eventinfo">
                    <div className="eventinfo-event">
                        <div>
                            <p className="eventinfo-event__adress"><span>Адрес:</span> {event.adress}</p>
                            <p className="eventinfo-event__date"><span>Дата:</span> {obj.day}</p>
                            <p className="eventinfo-event__time"><span>Время:</span> {obj.time}</p>
                            <p className="eventinfo-event__descr"><span>О событии:</span> {event.eventDescr}</p>
                        </div>
                        {   
                            event.playersNow == event.playersAll ?
                            <div className="eventinfo-event__btn no">На данный момент свободные места отсутствуют</div>
                            :
                            subsEvent.indexOf(event.event_id) >= 0 ? 
                                <div className="eventinfo-event__btn" onClick={(e) => handleDeleteClick(e, event.event_id)}>ОТПИСАТЬСЯ</div>
                            :
                                // <div className="eventinfo-event__btn" onClick={(e) => subOnEvent(e, event.event_id)}>ПОДПИСАТЬСЯ</div>
                                <div className="eventinfo-event__btn" onClick={(e) => subOnEvent(e, event.event_id)}>ПОДПИСАТЬСЯ</div>
                        }
                    </div>
                    <CourtInfo courtInfo={courtInfo}/>
                    <div className="eventinfo__close" onClick={() => closeInfo()}></div>
                </div>
            }
        </>
    )
}

export default EventInfo