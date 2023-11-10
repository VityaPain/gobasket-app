import React, {useCallback} from "react";

const useServerCourt = () => {
    
    const onRequest = useCallback(async (url, method="GET", body=null,headers = {}) => {
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

    // описание и картинки площадки
    const getDescrAndImages = async (courtId) => {
        const data = await onRequest(`http://localhost:3001/courts/descr/${courtId}`)

        console.log('court id: ', courtId)

        const obj = {description:'', images: []}
        data.court.map(item => {
            obj.images.push(item.path)
        })
        obj.description = data.court[0].description

        return obj
    }

    const getCourtById = async (courtId) => {
        const data = await onRequest(`http://localhost:3001/courts/${courtId}`)
        
        const paths = []
        data.court.map(item => paths.push(item.path))
        const obj = {...data.court[0]}
        obj.path = paths


        return obj
    }

    const getMarkers = async () => {
        const markers = await onRequest(`http://localhost:3001/courts/markers`)

        return markers.courts
    }

    const getSubsUserOnCourt = async (userId) => {
        const data = await onRequest(`http://localhost:3001/subcourtbyuser/user/${userId}`)

        return data.events
    }

    const cancelCourtSub = async (body) => {
        console.log(body)
        const response = await onRequest('http://localhost:3001/subcourtbyuser/', 'DELETE', JSON.stringify(body), {
            "Content-Type": "application/json"
        })
    
        console.log(response)
    }

    return {getDescrAndImages, getMarkers, getCourtById, getSubsUserOnCourt, cancelCourtSub}


}

export default useServerCourt