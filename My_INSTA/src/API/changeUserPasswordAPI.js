import axios from "axios";
import { changeUserPasswordAction } from "../redux/actions/changeUserPasswordAction";
import { BACKED_ADDRESS } from "../constants/constants";
export const changeUserPasswordAPI  = (userToken, formData) => {
    return function(dispatch) {

        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken                    
            }
        }

        const data = {
          "old_password":formData.lkeOldPassword,
          "new_password":formData.lkeNewpassword
        }
        

        const changePassword = axios.patch(`http://${BACKED_ADDRESS}/api/change-password/`, data, params);
        changePassword.then(response => {

            //диспатчим ActionCreator

            dispatch(changeUserPasswordAction(response)) 

        })
    }
}


