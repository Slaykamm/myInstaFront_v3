import axios from "axios";
import { getPrivateRoomsAction } from "../redux/ActionCreators";
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getPrivateRoomsAPI  = (value) => {
    return function(dispatch) {
        const privateRooms = axios.get(`http://${BACKED_ADDRESS}/api/privaterooms/?privateRoomMembers=${value}`);
        privateRooms.then(response => {

            //диспатчим ActionCreator

            dispatch(getPrivateRoomsAction(response.data)) 

        })
    }
}


