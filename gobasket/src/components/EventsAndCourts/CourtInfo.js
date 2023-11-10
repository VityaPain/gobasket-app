import React, {useEffect, useState, useRef, useCallback} from "react";

import useServerCourt from "../../services/useServerCourt";

import CourtSlider from "./CourtSlider"

const CourtInfo = ({courtInfo}) => {
    const [data, setData] = useState()

    let test = useRef()

    useEffect(() => {
        // getDescrAndImages(props.courtInfoId).then((data) => {
        //     console.log(data)
        //     // test.current = data
        //     setData(data)
        // })
    }, [])

    console.log('COURT INFO')
    console.log(courtInfo)

    test.current = courtInfo

    const renderInfo = useCallback(() => {
        console.log('DESCR: ', test.current)
    }, [])

    renderInfo()

    return (
        <>
            { test.current ? 
            <>
                <div className="eventinfo-court">
                    <p className="eventinfo-court__descr"><span>О площадке:</span> {test.current.description}</p>
                    <CourtSlider images={test.current.images}/>
                </div> 
                
            </>
            :
            null }
        </>

    )
}

export default CourtInfo