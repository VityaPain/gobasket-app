import React, {useEffect, useState, useCallback} from "react";

import DayList from "../DayList/DayList";
import useWeather from "../../services/useWeather";

import useServer from "../../services/useServer";

const Weather = () => {
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

    const {getDayWeather} = useWeather()

    const [weather, setWeather] = useState(null)
    const [dayNow, setDayNow] = useState(generateCorrectDate())

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = () => {
        getDayWeather(dayNow, dayNow)
            .then(data => setWeather(data))
    }

    const getNewDay = useCallback((date) => {
        getDayWeather(date, date)
            .then(data => setWeather(data))
    }, [])  

    const renderHourlyWeather = (arr) => {
        const res = arr.map((obj,i) => {
            return (
                <div className="weather-select__duration-item hour" key={i}>
                    <div className="hour-time">
                        {obj.time}
                    </div>
                    <div className="hour-weather">
                        <img src={obj.weather} alt="" />
                    </div>
                    <div className="hour-temp">
                        {obj.temp}&#176;
                    </div>
                </div>
            )
        })

        return res
    }

    let res = []
    // console.log(weather)
    if (weather !== null) {
        res = renderHourlyWeather(weather.hourlyWeather)
    }

    return (
        <section className="weather">
            <h1 className="weather-title title">Прогноз погоды</h1>
            {weather == null ? null : 
                <div className="weather-container" 
                    style={{"backgroundImage": `url(../${weather.img})`, "backgroundRepeat": "no-repeat"," backgroundPosition": "0 0", "backgroundSize": "cover"}}>
                    <div className="weather-select">
                        <div className="weather-select__now">
                            <div className="weather-select__now-info">
                                <div className="weather-select__now-city">Санкт-Петербург</div>
                                <div className="weather-select__now-clouds">{weather.weather}</div>
                                <div className="weather-select__now-temp">{weather.temp}&#176;</div>
                                <div className="weather-select__now-range">Макс. {weather.tempMax}&#176;, мин. {weather.tempMin}&#176;</div>
                                <div className="weather-select__now-wind">{weather.wind} <span>м/с</span></div>
                            </div>
                            <div className="weather-select__now-day">{weather.day}</div>
                        </div>
                        <div className="weather-select__duration">
                            {res}
                        </div>
                    </div>
                    <DayList getNewDay={getNewDay}/>
                </div>
            }
        </section>
    )
}

export default Weather;