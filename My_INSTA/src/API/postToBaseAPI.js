import axios from "axios";
import { postToBaseAction } from "../redux/actions/postToBaseAction";
import { BACKED_ADDRESS } from "../constants/constants";

//ф--------------функция для асинхронного запроса
export const postToBaseAPI  = (message, url) => {
    return function(dispatch) {
       const putMessage = axios.post(`http://${BACKED_ADDRESS}/api${url}/`, message);
       putMessage.then(resp2 => {
            console.log('resp', resp2)
            dispatch(postToBaseAction(resp2))
        })
    }
}

// 
//usage----------- Возвращает ID, который потом используется на фронте для добавления. Это важно!!!!!
// props.postToBaseAPI(message, url)
// {
//     "text": "И Мне!",
//     "rating": 0,
//     "create_at": "2022-03-24T21:07:35.340028Z",
//     "author": 6,
//     "video": 1
// }