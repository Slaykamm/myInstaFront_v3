import axios from "axios";
import { getUserAvatarAction } from '../redux/actions/getUserAvatarAction'
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getUserAvatarAPI  = (id) => {
    return function(dispatch) {
        const getAvatar = axios.get(`http://${BACKED_ADDRESS}/api/author/?id=${id}`);
        getAvatar.then(response => {

            console.log('response', response)
            dispatch(getUserAvatarAction(response)) 

        })
    }
}


