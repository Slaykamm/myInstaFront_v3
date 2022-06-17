import axios from "axios";
import { verifyUserAction } from "../redux/actions/verifyUser";
import { get } from 'lodash'

//ф--------------функция для асинхронного запроса
export const getCheckUserAPI  = (userData) => {
    return function(dispatch) {

        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': get(userData,['Authorization'])                    
            }
        }



        console.log('params', params)

        const logingPostAPI = axios.get(`http://127.0.0.1:8000/api/users/?username=${get(userData,['username'])}`, params);
        logingPostAPI.then(response => {
            console.log(response)
            //диспатчим ActionCreator
            dispatch(verifyUserAction(response)) 
        })

        logingPostAPI.catch((err) => {
            console.log('ERRROR', err.response)
            dispatch(verifyUserAction(err.response))
        })
    }
}


