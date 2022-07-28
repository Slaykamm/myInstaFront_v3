import axios from "axios";
import { getVideoOwnerUserAction } from "../redux/ActionCreators";
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getVideoUserOwnerAPI  = (value) => {
    return function(dispatch) {
        if (value){
            const videoFilteredUser = axios.get(`http://${BACKED_ADDRESS}/api/video/?author=${value}`);
            videoFilteredUser.then(response => {
                //диспатчим ActionCreator
                dispatch(getVideoOwnerUserAction(response.data)) 
    
            })
        }

    }
}


