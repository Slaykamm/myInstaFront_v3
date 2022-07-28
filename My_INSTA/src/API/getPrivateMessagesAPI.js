import axios from "axios";
import { getPrivateMessagesAction } from "../redux/actions/getPrivateMessagesAction";
import { BACKED_ADDRESS } from "../constants/constants";

//ф--------------функция для асинхронного запроса
export const getPrivateMessagesAPI  = (value) => {

    return function(dispatch) {

        const privateMessagesToUser = [];
        if (value){
            value.map(val=> {
                const privateMessages = axios.get(`http://${BACKED_ADDRESS}/api/prvatemessages/?privateRoom=${val.id}`)
                privateMessages.then(response => {
                        privateMessagesToUser.push(response.data)
                        //concat(privateMessagesToUser, response.data)
                        if (privateMessagesToUser.length === value.length){
                            dispatch(getPrivateMessagesAction(privateMessagesToUser)) 
                        }
                        
                    })
                })
                
            }
            

            //диспатчим ActionCreator

            

    }
}


