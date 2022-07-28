import axios from "axios";
import { getPrivateRoomsMultiUsersAction } from "../redux/actions/getPrivateRoomsMultiUsersAction";
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getPrivateRoomsAPI  = (value) => {
    return function(dispatch) {
        const privateRooms = axios.get(`http://${BACKED_ADDRESS}/api/privaterooms/?privateRoomMembers=${value}`);
        privateRooms.then(response => {

            //диспатчим ActionCreator

            dispatch(getPrivateRoomsMultiUsersAction(response.data)) 

        })
    }
}


