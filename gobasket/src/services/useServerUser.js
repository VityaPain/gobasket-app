import React, {useCallback} from "react";

const useServerUser = () => {
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

  const getUserInfo = async (userId) => {
    const data = await onRequest(`http://localhost:3001/users/${userId}`)

    console.log(data.user[0])

    return data.user[0]
  }

  return {getUserInfo}
}

export default useServerUser