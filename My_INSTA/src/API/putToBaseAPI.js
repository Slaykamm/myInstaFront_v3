import axios from "axios";
import { putToBaseAction } from "../redux/actions/putToBaseAction";
import { BACKED_ADDRESS } from "../constants/constants";

//ф--------------функция для асинхронного запроса
export const putToBaseAPI  = (message, url, id) => {
    return function(dispatch) {
         
       const putMessage = axios.patch(`http://${BACKED_ADDRESS}/api${url}/${id}/`, message);
       putMessage.then(resp2 => {
            console.log('resp', resp2)
            dispatch(putToBaseAction(resp2))
        })
    }
}


//usage-----------
// const message = {
//     "lastOpenDate": new Date().toISOString() 
// }

// const url = '/privaterooms'

// props.putToBase(message, id, url)