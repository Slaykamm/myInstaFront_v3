import axios from "axios";
import { createNewVideoAction } from "../redux/actions/createNewVideoAction";
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const createNewVideoAPI  = (payload) => {
    return function(dispatch) {

        console.log('api', payload)
        
        const createVideo = axios.post(`http://${BACKED_ADDRESS}/api/video/`, payload);
        createVideo.then(response => {

            //диспатчим ActionCreator
            console.log('response', response)
            dispatch(createNewVideoAction(response)) 

        })
    }
}


