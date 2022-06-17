import React from 'react'
import { getPutToBaseResult } from '../redux/Selectors/baseSelectors'
import { putToBaseAPI } from '../API/putToBaseAPI'
import { useEffect } from 'react'
import { connect } from 'react-redux'




/**
 * Ендпоинт для сохранения нового имени группы.
 * @endpoint http://127.0.0.1:8000/api/privaterooms/
 * @service putToBaseAPI
 * @param {"privateChatName": newRoomName} newRoomName - новое название комнаты
 */
export const cnangeRoomService = (roomId, newRoomName) => {
    console.log('from service', roomId, newRoomName )
    
    const payload = {
        "privateChatName": newRoomName 
    }
    const url = '/privaterooms'
    props.putToBase(payload, url, roomId)
}


function EndPointServices(props) {
    return (
        <div>Hello world!</div>
    )
}


export default connect(
    //mapStateToProps
    state => ({

        putToBaseResult: getPutToBaseResult(state),

    }),
    //mapDispatchToProps
    dispatch => ({

        putToBase: (value, url, id) => {
            dispatch(putToBaseAPI(value, url, id))
        },
    })

)(EndPointServices)