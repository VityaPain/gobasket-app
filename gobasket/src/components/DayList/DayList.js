import React, {useEffect, useState, useCallback} from "react";

import useWeather from "../../services/useWeather";



const DayList = (props) => {
    const daysInMonth = {
        0: 31,
        1: 28,
        2: 31,
        3: 30,
        4: 31,
        5: 30,
        6: 31,
        7: 31,
        8: 30,
        9: 31,
        10: 30,
        11: 31,
    }

    // получить нужную форму даты
    const generateCorrectDate = (plus=0) => {
        let year = new Date().getFullYear(),
                month = new Date().getMonth().toString().length == 1 ? `0${new Date().getMonth()+1}` : `${new Date().getMonth()+1}`
        let day

        if (new Date().getDate() + plus == (new Date().getDate() + plus) % daysInMonth[new Date().getMonth()]) {
            day = (new Date().getDate() + plus).toString().length == 1 ? `0${new Date().getDate() + plus}` : `${new Date().getDate() + plus}`
            return `${year}-${month}-${day}`
        }
        else {
            month = new Date().getMonth().toString().length == 1 ? `0${new Date().getMonth()+2}` : `${new Date().getMonth()+2}`
            day = ((new Date().getDate() + plus) % daysInMonth[new Date().getMonth()]).toString().length == 1 ? `0${(new Date().getDate() + plus) % daysInMonth[new Date().getMonth()]}` : `${(new Date().getDate() + plus) % daysInMonth[new Date().getMonth()]}`
            return `${year}-${month}-${day}`
        }    
    }


    const [dayList, setDayList] = useState([])
    const [weekStart, setWeekStart] = useState(generateCorrectDate())
    const [weekEnd, setWeekEnd] = useState(generateCorrectDate(6))

    const {getWeekWeather} = useWeather()

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = useCallback(() => {
        getWeekWeather(weekStart, weekEnd)
            .then(data => setDayList(data))
    }, [])

    const renderWeekWeather = (arr) => {
        const days = arr.map((day, i) => {
            return (
                <li className="weather-another__item" key={day.code} date={day.code}
                    onClick={() => props.getNewDay(day.code)}>
                    <div className="weather-another__item-name">{day.nameDay}</div>
                    <div className="weather-another__item-icon">
                        <img src={day.weathercode} alt="" />
                    </div>
                    <div className="weather-another__item-daytemp">{day.tempDay}&#176;</div>
                    <div className="weather-another__item-nighttemp">{day.tempNight}&#176;</div>
                    <div className="weather-another__item-windspeed">{day.windspeed}<span>м/с</span></div>
                </li>
            )
        })
        return (
            <ul className="weather-another">
                {days}
            </ul>
        )
    }

    // console.log(dayList)
    const days = renderWeekWeather(dayList)
    return (
        <>
            {days}
        </>
    )

}

export default DayList