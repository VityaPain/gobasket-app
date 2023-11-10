import React, {useState, useCallback, useEffect, useMemo} from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import CourtSlider from "../EventsAndCourts/CourtSlider"

import useServerCourt from "../../services/useServerCourt";

import markerMap from "../../resources/img/markerMap.svg"

const Mapbox = () => {
    const [viewState, setViewState] = useState({
        longitude: 30.2958,
        latitude: 59.9291,
        zoom: 10
    });

    const {getMarkers, getCourtById} = useServerCourt()

    const [markers, setMarkers] = useState()
    const [courtSelectedId, setCourtSelectedId] = useState(null)
    const [coordSelectedCourt, setCoordSelectedCourt] = useState({longitude:'', latitude: ''})
    const [courtData, setCourtData] = useState(null)

    useEffect(() => {
        onRequest()
        document.addEventListener("keydown", handleClosePopup)
    }, [])

    function handleClosePopup(e) {
        if (e.keyCode == 27) {
            setCourtSelectedId(null)
            setCourtData(null)
        }
    }

    useEffect(() => {
        if (courtSelectedId) {
            getCourtById(courtSelectedId).then(data => setCourtData(data))
        }
    }, [courtSelectedId])

    const onRequest = useCallback(() => {
        getMarkers().then(data => setMarkers(data))
    }, [])

    // движение карты
    const onMove = useCallback(({viewState}) => {
        const newViewState = {
          ...viewState,
          longitude: viewState.longitude,
          latitude: viewState.latitude
        };
        setViewState(newViewState);
    }, []);

    const handleClickMarker = (id, lat, long) => {
        setCourtSelectedId(null)
        setCourtData(null)

        setCourtSelectedId(id)
        setCoordSelectedCourt({
            longitude: long,
            latitude: lat
        })
    }

    const renderMarkers = useCallback((data) => {
        if (markers) {
            const arr = data.map(item => {
                return (
                    <Marker 
                        key={item.court_id}
                        latitude={+item.latitude}
                        longitude={+item.longitude}

                    >
                        <button
                            onClick={() => handleClickMarker(item.court_id, item.latitude, item.longitude)}
                            >
                            <img
                                src={markerMap}
                            />
                        </button>
                    </Marker>
                )
            })
    
            return arr
        }

    }, [markers])

    const m = renderMarkers(markers)

    return (
        <div className="events-content__map">
            <ReactMapGL 
                {...viewState}
                mapboxAccessToken="pk.eyJ1Ijoidml0eWFwYWluIiwiYSI6ImNsZ2UwMjBpcjIwaDAza3BpcGo1dWw1bWoifQ.NVyFHEt4nARp1YyxCLuLoA"
                onMove={onMove}
                mapStyle="mapbox://styles/vityapain/clhz3jj2202b801png6or13yl"
                language="ru"          
            >   
                {m}
                
                {/* {popup} */}
                {courtSelectedId && courtData? 
                    <Popup {...coordSelectedCourt}>
                        <h2>{courtData.adress}</h2>
                        <p>{courtData.description}</p>
                        <CourtSlider images={courtData.path}/>
                    </Popup>
                    : null
                }
            </ReactMapGL>
        </div>
    )
}

export default Mapbox