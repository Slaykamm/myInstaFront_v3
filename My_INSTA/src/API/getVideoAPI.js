import axios from "axios";
import { getVideoAction } from "../redux/ActionCreators";
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getVideoAPI  =  (id) => {
    return function(dispatch) {
         const videoPreviewsAPI =  axios.get(`http://${BACKED_ADDRESS}/api/video/${id}`);
        videoPreviewsAPI.then(response => {

            //диспатчим ActionCreator

            dispatch(getVideoAction(response.data)) 

        })
    }
}
//module.exports = getVideoAPI;