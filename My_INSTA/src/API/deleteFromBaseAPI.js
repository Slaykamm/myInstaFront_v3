import axios from "axios";
import { deleteFromBaseAction } from "../redux/actions/deleteFromBaseAction";
import { BACKED_ADDRESS } from "../constants/constants";

//ф--------------функция для асинхронного запроса
export const deleteFromBaseAPI  = (id, url) => {
    return function(dispatch) {
       const putMessage = axios.delete(`http://${BACKED_ADDRESS}/api${url}/${id}/`);
       putMessage.then(resp2 => {
            dispatch(deleteFromBaseAction(resp2))
        })
    }
}


//usage-----------

// const url = '/privaterooms'

// props.putToBase(id, url)