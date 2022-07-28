import axios from "axios";
import { postUserPrivateAction } from "../redux/actions/postPrivateUserAction";
import { BACKED_ADDRESS } from "../constants/constants";

//ф--------------функция для асинхронного запроса
export const postMessageAPI  = (roomID, roomName, message, userID) => {
    return function(dispatch) {

        const mess = {
            "text": message,
            "create_at": new Date().toISOString(),
            "author": userID,
            "privateRoom": roomID
        }

        console.log('mess postMessageAPI', mess)

       const postPrivateMessAPI = axios.post(`http://${BACKED_ADDRESS}/api/prvatemessages/`, mess);

       postPrivateMessAPI.then(resp2 => {
            dispatch(postUserPrivateAction(resp2))

        })


    }
}


