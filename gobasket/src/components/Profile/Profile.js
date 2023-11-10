import React, {useEffect, useState, useContext, useRef, createRef} from "react";

import { useCookies } from 'react-cookie';

import useServerUser from "../../services/useServerUser";
import useServer from "../../services/useServer";
import useServerCourt from "../../services/useServerCourt";

import avatar from "../../resources/img/deku.webp";
import editBtn from "../../resources/img/editBtn.svg";
import submitBtn from "../../resources/img/submitBtn.svg";
import delBtn from "../../resources/img/delBtn.svg"



const Profile = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['userId']);

    const [userInfo, setUserInfo] = useState()
    const [showRegistrationForm, setShowRegistrationForm] = useState(false)
    const [readOnlyMode, setReadOnlyMode] = useState(true)
    const [subsEventUser, setSubsEventUser] = useState()
    const [subsCourtUser, setSubsCourtUser] = useState()

    const authFormRef = useRef()
    const refistrFormRef = useRef()
    const editProfileFormRef = useRef()

    const activeChapter = createRef()

    const {getUserInfo} = useServerUser()
    const {getSubsUser, delEvent} = useServer()
    const {getSubsUserOnCourt, cancelCourtSub} = useServerCourt()
    
    const nick = "VityaPain666"
    const team = "TriplePain"
    const about = "Лучший баскетболист города Санкт-Петербург. Играю на позициях 1-2. Готов вступить в новую команду"

    useEffect(() => {
        if (cookies.userId) {
            getUserInfo(cookies.userId).then(data => setUserInfo(data))
            eventSubsUser()
            courtSubsUser()
        } else {
            setUserInfo(null)
        }

        document.addEventListener("keydown", handleEscPressed)

        return () => {
            document.removeEventListener("keydown", handleEscPressed)
        }
    }, [])

    const eventSubsUser = async () => {
        await getSubsUser(cookies.userId).then(data => setSubsEventUser(data))
    }
    const courtSubsUser = async () => {
        await getSubsUserOnCourt(cookies.userId).then(data => setSubsCourtUser(data))
    }

    function handleEscPressed(e) {
        if (e.keyCode == 27) {
            setShowRegistrationForm(null)
        }
    }

    useEffect(() => {
        if (cookies.userId) {
            getUserInfo(cookies.userId).then(data => setUserInfo(data))
            eventSubsUser()
            courtSubsUser()
        }
    }, [cookies.userId])

    const handleSubmit = async (e) => {
        e.preventDefault()  
        const response = await fetch(`http://localhost:3001/users/login/${authFormRef.current.elements.login.value}/${authFormRef.current.elements.password.value}`)
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
            let json = await response.json();
            if (json.user.length > 0) {
                console.log(json)
                setCookie('userId', json.user[0].user_id)
            } else {
                authFormRef.current.elements.login.value = ''
                authFormRef.current.elements.password.value = ''
                alert('Неверный логин или пароль')
            }

        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    const handleSubmitCreate = async (e) => {
        e.preventDefault()
        if (refistrFormRef.current.elements.password1.value == refistrFormRef.current.elements.password2.value) {
            const body = {
                name: refistrFormRef.current.elements.login.value,
                password: refistrFormRef.current.elements.password1.value,
                descr: refistrFormRef.current.elements.about.value
            }
            const response = await fetch('http://localhost:3001/users', {
                method: "POST",
                body: JSON.stringify(body),
                headers:{"Content-Type": "application/json"}
            })
            if (response.ok) {
                alert('Вы зарегестрированы')
                refistrFormRef.current.reset()
                setShowRegistrationForm(null)
            } else {
                alert("Ошибка HTTP: " + response.status);
            }
        }
        else {
            refistrFormRef.current.elements.password1.value=''
            refistrFormRef.current.elements.password2.value=''
            alert("Пароли различны друг от друга")
        }
    }

    const handleSubmitEditProfile = async (e) => {
        e.preventDefault()
        const body = {
            userId: cookies.userId,
            name: editProfileFormRef.current.elements.name.value,
            descr: editProfileFormRef.current.elements.about.value,
        }
        const response = await fetch('http://localhost:3001/users', {
            method: "PUT",
            body: JSON.stringify(body),
            headers:{"Content-Type": "application/json"}
        })
        if (response.ok) {
            setReadOnlyMode(true)
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    const getActiveSection = e => {
        if (activeChapter.current == e.target.parentElement) {
            activeChapter.current.classList.toggle('active')
        }
        else {
            activeChapter.current.classList.remove('active')
            activeChapter.current = e.target.parentElement
            activeChapter.current.classList.add('active')
        }
    }

    const getDateAndTime = (dateStr) => {
        const [date, time] = dateStr.split('T')

        const newDate = new Date(date)
        const month = newDate.toLocaleString('default', { month: 'long' }),
              day = newDate.getDate()

        return {
            day: `${month.toLocaleUpperCase()}, ${day}`,
            time: time.slice(0, 5),
            // time: getLocalTime(time.slice(0, 5)),
            date: date
        }
    }
    const getLocalTime = (time) => {
        const hours = +(time.split(':')[0])
        return `${hours}:${time.split(':')[1]}`
    }

    const renderListEventSubs = (subs) => {
        const cancelSubEvent = (e, eventId) => {
            e.preventDefault()

            const body = {
                "eventId": eventId,
                "userId": cookies.userId
            }
    
            delEvent(body).then(() => {eventSubsUser()})
        }

        const arr = subs.map((event, i) => {
            const {day, time} = getDateAndTime(event.time)

            return (
                <li key={i} className="row list-item">
                    <div className="list-item__info">
                        <div className="list-item__info-adress">
                                {event.adress}
                            </div>
                        <div className="list-item__info-time">
                            {time} | {day} | {event.playersNow} / {event.playersAll}
                        </div>
                    </div>
                    <img 
                        onClick={(e) => {cancelSubEvent(e, event.event_id)}}
                        style={{width: "15px", cursor: "pointer"}} 
                        className="list-item__cancel"
                        src={delBtn} 
                        alt="" />
                </li>
            )
        })

        return arr
    }

    const renderListCourtSubs = (subs) => {
        const cancelSubCourt = (e, courtId) => {
            e.preventDefault()

            const body = {
                "courtId": courtId,
                "userId": cookies.userId
            }
    
            cancelCourtSub(body).then(() => {courtSubsUser()})
        }

        const arr = subs.map((court, i) => {

            return (
                <li key={i} className="row list-item">
                    <div className="list-item__court">
                        {court.adress}
                    </div>
                    <img 
                        onClick={(e) => {cancelSubCourt(e, court.court_id)}}
                        style={{width: "15px", cursor: "pointer"}} 
                        className="list-item__cancel"
                        src={delBtn} 
                        alt="" />
                </li>
            )
        })

        return arr
    }

    const eventSubs = subsEventUser ? renderListEventSubs(subsEventUser) : null
    const courtSubs = subsCourtUser ? renderListCourtSubs(subsCourtUser) : null

    return (
        <section className="profile">
            <div className="profile-container container user">
                {
                    cookies.userId && userInfo ? 
                    <>
                        <form method="PUT" ref={editProfileFormRef} onSubmit={e => handleSubmitEditProfile(e)} className="profile-userinfo">
                            <div className="profile-userinfo__top">
                                <div className="profile-userinfo__top-avatar">
                                    <img className="user__ava" src={avatar} alt="" />
                                </div>
                                <div className="profile-userinfo__top-presentation">
                                    <div className="row" style={{justifyContent:"flex-start"}}>
                                        {
                                            readOnlyMode ? 
                                            <img 
                                                style={{width: "20px", cursor: "pointer"}} 
                                                src={editBtn} 
                                                alt="edit" 
                                                onClick={() => {setReadOnlyMode (false)}}/> :
                                            <button  type="submit">
                                                <img
                                                    style={{width: "20px", cursor: "pointer"}} 
                                                    src={submitBtn} 
                                                    alt="edit" 
                                                    // onClick={() => {setReadOnlyMode(false)}}
                                                    />
                                            </button>

                                        }

                                        <input type="text" 
                                                className="user__nick" 
                                                name="name" 
                                                defaultValue={userInfo.user_name}
                                                readOnly={readOnlyMode} />
                                    </div>

                                    <p className="user__team">
                                        Команда: 
                                        <span>{userInfo.team_name}</span>
                                    </p>
                                    
                                    <div className="clear" onClick={() => removeCookie('userId')}>
                                        выйти
                                    </div>
                                </div>
                            </div>
                            <div className="profile-userinfo__bottom">
                                <textarea 
                                    name="about" 
                                    cols="30" 
                                    rows="10"
                                    defaultValue={userInfo.description == '' ? 'Тут пока ничего нет...' : userInfo.description} 
                                    readOnly={readOnlyMode}/>
                            </div>
                        </form>
                        <ul className="profile-events">
                            <li ref={activeChapter} className="profile-events__item active">
                                <div className="profile-events__item-header" onClick={e => getActiveSection(e)}>
                                    События
                                </div>
                                <ul className="profile-events__item-list list">
                                    {eventSubs}
                                </ul>
                            </li>
                            <li className="profile-events__item">
                                <div className="profile-events__item-header" onClick={e => getActiveSection(e)}>
                                    Площадки
                                </div>
                                <ul className="profile-events__item-list">
                                    {courtSubs}
                                </ul>
                            </li>
                            <li className="profile-events__item">
                                <div className="profile-events__item-header" onClick={e => getActiveSection(e)}>
                                    Команда
                                </div>
                                <ul className="profile-events__item-list">
                                    <h3>Данный блок находится в разработке</h3>
                                </ul>
                            </li>
                        </ul>
                    </>
                    :
                    <div className="auth-container">
                        <h2 className="title">Авторизация</h2>
                        <form ref={authFormRef} method="GET" onSubmit={(e) => handleSubmit(e)} className="auth-login">
                            <input type="text" name="login" placeholder="Login" required/>
                            <input type="password" id="pass" name="password" placeholder="Password" minLength="8" maxLength="17" required />
                            <input type="submit" value="Войти" />
                        </form>
                        <div className="auth-container__registr" onClick={() => setShowRegistrationForm(true)}>Регистрация</div>
                        {
                            showRegistrationForm ? 
                            <div className="registr-container">
                                <h2 className="title">Регистрация</h2>
                                <form ref={refistrFormRef} method="POST" onSubmit={(e) => handleSubmitCreate(e)} className="registr-login">
                                    <input type="text" name="login" placeholder="Login" required/>
                                    <div className="row">
                                        <input type="password" id="pass1" name="password1" placeholder="Password" minLength="8" maxLength="17" required />
                                        <input type="password" id="pass2" name="password2" placeholder="Password again" minLength="8" maxLength="17" required />
                                    </div>
                                    <textarea 
                                        name="about" 
                                        id="about" 
                                        cols="50" 
                                        rows="7"
                                        placeholder="About you"/>
                                    <input type="submit" value="Зарегистрироваться" />
                                </form>
                                <div className="registr-container__close" onClick={() => setShowRegistrationForm(false)}></div>
                            </div>
                            :
                            null
                        }
                    </div>
                }
            </div>
        </section>
    )
}

export default Profile