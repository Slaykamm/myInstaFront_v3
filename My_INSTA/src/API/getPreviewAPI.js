import axios from "axios";
import { getPreviewAPI } from "../redux/ActionCreators";
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getVideoPreviewsAPI  = () => {
    return function(dispatch) {
        const videoPreviewsAPI = axios.get(`http://${BACKED_ADDRESS}/api/video/`);
        videoPreviewsAPI.then(response => {

            //диспатчим ActionCreator
            dispatch(getPreviewAPI(response.data)) 

        })
    }
}


