import axios from "axios";
import { postUserRoomAction } from "../redux/actions/postUserRoomAction";
import { getIndexesFromPrivateRoomNameService } from "../services/roomNamesService";
import { get } from 'lodash'
import { BACKED_ADDRESS } from "../constants/constants";


//ф--------------функция для асинхронного запроса
export const postRoomAPI  = (value, message, userID) => {
    return function(dispatch) {

        const [type, index1, index2] =  getIndexesFromPrivateRoomNameService(value)
        
       let usersID = new Array;
        usersID.push(index1)
        usersID.push(index2)

        

        const params = {
            "privateChatName": value,
            "lastOpenDate": new Date().toISOString(),
            "privateRoomMembers": usersID
        }

        const getRoomAPI = axios.post(`http://${BACKED_ADDRESS}/api/privaterooms/`, params);
        getRoomAPI.then(response => {

            const mess = {
                "text": message,
                "create_at": new Date().toISOString(),
                "author": userID,
                "privateRoom": get(response.data, ['id'])
            }
            console.log('mess', mess)
            

            const postPrivateMessAPI = axios.post(`http://${BACKED_ADDRESS}/api/prvatemessages/`, mess);

            postPrivateMessAPI.then(resp2 => {
                dispatch(postUserRoomAction(resp2))

            })



        })


    }
}


