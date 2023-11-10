import React, {useCallback, useState} from "react";

const useWeather = () => {

    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

    const options = {
        method: 'GET',
        headers: {
    
        }
    };

    const onRequest = useCallback(async (dataStart, dataEnd, method="GET", body=null,headers = {}) => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=60.03&longitude=30.33&hourly=temperature_2m,rain,weathercode,cloudcover,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&windspeed_unit=ms&timezone=Europe%2FMoscow&start_date=${dataStart}&end_date=${dataEnd}`, {method, body, headers})
        
            if (!response.ok) {
                throw new Error(`Could not fetch status: ${response.url}`);
            }

            const data = await response.json()

            return data
        } catch(e) {
            throw e;
        }
    })

    // погода на неделю
    const getWeekWeather = async (dataStart, dataEnd) => {
        const data = await onRequest(dataStart, dataEnd)
        let objDays = []

        // код погоды (иконка)
        for (let i = 0; i < data.daily.weathercode.length; i++) {
            objDays[i] = {}
            objDays[i].code = data.daily.time[i]

            const weather = data.daily.weathercode[i]

            console.log(weather)

            objDays[i].weathercode = weather == 3 ? './img/weatherIcons/murky.svg' :
                                weather== 2 ? './img/weatherIcons/cloudly.svg' :
                                weather == 1 ? './img/weatherIcons/partly.svg':
                                weather == 0 ? './img/weatherIcons/clear.svg':
                                weather == 45 ? './img/weatherIcons/foggy.svg':
                                weather == 61 ? './img/weatherIcons/littlerain.svg':
                                weather == 63 ? './img/weatherIcons/rain.svg':
                                weather == 65 || weather >= 80 && weather <= 82 ? './img/weatherIcons/bigrain.svg':
                                weather >= 95 && weather <= 99 ?'./img/weatherIcons/storm.svg': './img/weatherIcons/nodata.svg'
                                // weather >= 95 && weather <= 99 ?'./img/weatherIcons/storm.svg': './img/weatherIcons/murky.svg'
        }

        // темпа днем и ночью
        let dataArr = []
        for (let i = 0; i < data.hourly.temperature_2m.length; i += 24) {
            const day = data.hourly.temperature_2m.slice(i, i + 24)
            dataArr.push(day)
        }
        dataArr.map((arr, index) => {
            objDays[index].tempDay = Math.floor(getAvgTempForDayAndNight(arr)[0])
            objDays[index].tempNight = Math.floor(getAvgTempForDayAndNight(arr)[1])
        })

        // ветер за день
        dataArr = []
        for (let i = 0; i < data.hourly.windspeed_10m.length; i += 24) {
            const day = data.hourly.windspeed_10m.slice(i, i + 24)
            dataArr.push(day)
        }
        dataArr.map((arr, index) => {
            objDays[index].windspeed = Math.floor(arr.reduce((a, b) => (a + b)) / arr.length)
        })

        // День недели
        for (let i = 0; i < data.daily.time.length; i += 1) {
            objDays[i].nameDay = days[new Date(data.daily.time[i]).getDay()]
        }

        return objDays
    }

    // получить нужную форму даты
    const generateCorrectDate = (now=true) => {
        if (now) {
            const year = new Date().getFullYear(),
            month = new Date().getMonth().toString().length == 1 ? `0${new Date().getMonth()+1}` : `${new Date().getMonth()+1}`,
            day = new Date().getDate().toString().length == 1 ? `0${new Date().getDate()}` : `${new Date().getDate()}`

            return `${year}-${month}-${day}`
        } else {
            const year = new Date().getFullYear(),
            month = new Date().getMonth().toString().length == 1 ? `0${new Date().getMonth()+1}` : `${new Date().getMonth()+1}`,
            day = new Date().getDate().toString().length == 1 ? `0${new Date().getDate() + 1}` : `${new Date().getDate() + 1}`

            return `${year}-${month}-${day}`
        }
    }

    // погода на день
    const getDayWeather = async (date) => {
        if (new Date(date).getDate() == new Date().getDate()) {
            const data = await onRequest(generateCorrectDate(), generateCorrectDate(false))

            const hourNowIndex = data.hourly.time.indexOf(data.current_weather.time)

            return {
                day: days[new Date(date).getDay()],
                temp: Math.round(data.current_weather.temperature),
                code: data.current_weather.weathercode,
                weather: data.current_weather.weathercode == 3 ? 'Пасмурно' :
                        data.current_weather.weathercode == 2 ? 'Облачно' :
                        data.current_weather.weathercode == 1 ? 'Малооблачно':
                        data.current_weather.weathercode == 0 ? 'Ясно':
                        data.current_weather.weathercode == 45 ? 'Туманно':
                        data.current_weather.weathercode >= 61 && data.current_weather.weathercode <= 67? 'Дождь':
                        data.current_weather.weathercode >= 80 && data.current_weather.weathercode <= 82? 'Ливень':
                        data.current_weather.weathercode >= 95 && data.current_weather.weathercode <= 99? 'Гроза' : 'Нет данных',
                wind: Math.round(data.current_weather.windspeed),
                tempMax: Math.round(data.daily.temperature_2m_max[0]),
                tempMin: Math.round(data.daily.temperature_2m_min[0]),
                img: "./img/weatherBackgrounds/fill_c3.png",
                hourlyWeather: getHourlyWeather(
                                                true, 
                                                data.hourly.time.slice(hourNowIndex, hourNowIndex+24),
                                                data.hourly.temperature_2m.slice(hourNowIndex, hourNowIndex+24),
                                                data.hourly.weathercode.slice(hourNowIndex, hourNowIndex+24),
                                                )
            }
        } else {
            const data = await onRequest(date, date)

            console.log(data)

            return {
                day: days[new Date(date).getDay()],
                code: data.current_weather.weathercode,
                weather: data.daily.weathercode[0] == 3 ? 'Пасмурно' :
                        data.daily.weathercode[0] == 2 ? 'Облачно' :
                        data.daily.weathercode[0] == 1 ? 'Малооблачно':
                        data.daily.weathercode[0] == 0 ? 'Ясно':
                        data.daily.weathercode[0] == 45 ? 'Туманно':
                        data.daily.weathercode[0] >= 61 && data.daily.weathercode[0] <= 67? 'Дождь':
                        data.daily.weathercode[0] >= 80 && data.daily.weathercode[0] <= 82? 'Ливень':
                        data.daily.weathercode[0] >= 95 && data.daily.weathercode[0] <= 99? 'Гроза' : 'Нет данных',
                tempMax: Math.round(data.daily.temperature_2m_max[0]),
                tempMin: Math.round(data.daily.temperature_2m_min[0]),
                temp: Math.round(getAvgTempForDayAndNight(data.hourly.temperature_2m)[0]),
                wind: Math.round(getAvgTempForDayAndNight(data.hourly.windspeed_10m)[0]),
                img: "./img/weatherBackgrounds/fill_c3.png",
                hourlyWeather: getHourlyWeather(
                                                false, 
                                                data.hourly.time, 
                                                data.hourly.temperature_2m, 
                                                data.hourly.weathercode
                                                )
                
            }
        }

    }

    const getHourlyWeather = (today, time, temp, weather) => {
        let arr = []
        for (let i = 0; i < 24; i++) {
            arr.push({
                time: time[i].slice(-5, -3),
                temp: Math.round(temp[i]),
                weather: weather[i] == 3 ? './img/weatherIcons/murky.svg' :
                    weather[i]== 2 ? './img/weatherIcons/cloudly.svg' :
                    weather[i] == 1 ? './img/weatherIcons/partly.svg':
                    weather[i] == 0 ? './img/weatherIcons/clear.svg':
                    weather[i] == 45 ? './img/weatherIcons/foggy.svg':
                    weather[i] == 61 ? './img/weatherIcons/littlerain.svg':
                    weather[i] == 63 ? './img/weatherIcons/rain.svg':
                    weather[i] == 65 || weather[i] >= 80 && weather[i] <= 82 ? './img/weatherIcons/bigrain.svg':
                    weather[i] >= 95 && weather[i] <= 99 ?'./img/weatherIcons/storm.svg': './img/weatherIcons/nodata.svg'
            })
        }

        return arr
    }

    function getMostRepetition(arr) {
        var mf = 1;
        var m = 0;
        var item;
        for (var i=0; i<arr.length; i++)
        {
            for (var j=i; j<arr.length; j++)
            {
                    if (arr[i] == arr[j])
                        m++;
                    if (mf<m)
                    {
                        mf=m; 
                        item = arr[i];
                    }
            }
            m=0;
        }
        return item == 3 ? ['Пасмурно', './img/weatherIcons/murky.svg'] :
                            item == 2 ? ['Облачно', './img/weatherIcons/cloudly.svg'] :
                            item == 1 ? ['Малооблачно', './img/weatherIcons/partly.svg']:
                            item == 0 ? ['Ясно', './img/weatherIcons/clear.svg']:
                            item == 45 ? ['Туманно', './img/weatherIcons/foggy.svg']:
                            item == 61 ? ['Небольшой дождь', './img/weatherIcons/littlerain.svg']:
                            item == 63 ? ['Дождь', './img/weatherIcons/rain.svg']:
                            item == 65 || item >= 80 && item <= 82 ? ['Ливень', './img/weatherIcons/bigrain.svg']:
                            item >= 95 && item <= 99 ? ['Гроза', './img/weatherIcons/storm.svg'] : ['Нет данных', './img/weatherIcons/nodata.svg']
    }
    function getAvgTempForDayAndNight(arr) {
        let day = [],
            night = []
        arr.map((item, i) => {
            if (i <= 8 || i > 19) {
                night.push(item)
            } else {
                day.push(item)
            }
        })

        return [day.reduce((a, b) => (a + b)) / day.length, night.reduce((a, b) => (a + b)) / night.length]
    }

    return {getWeekWeather, getDayWeather}
}

export default useWeather