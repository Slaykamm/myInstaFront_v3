import axios from "axios";
import { putNewUserDataAction } from "../redux/actions/putNewUserDataAction";


//ф--------------
export const putNewUserDataAPI  = (message, url, id, userToken, password, authorID, phoneData) => {
    return function(dispatch) {
         console.log('url', url)
         
        
       const putMessage = axios.patch(`http://127.0.0.1:8000/api${url}/${id}/`, message);
       putMessage.then(resp2 => {
            console.log('step1 email and Name OK!', resp2)


            const params = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken                    
                }
            }
            console.log('userToken', userToken)
            // меняем пароль на новый
            const data = {
              "old_password":'qwe+12345',
              "new_password": password
            }
            
    
            const changePassword = axios.patch(`http://127.0.0.1:8000/api/change-password/`, data, params);
            changePassword.then(responsePassword => {
    
                console.log('step2 passwordChanged', responsePassword)

                const putPhone = axios.patch(`http://127.0.0.1:8000/api/author/${authorID}/`, phoneData);
                putMessage.then(respPhoneAuthor => {
                     console.log('step3 respPhoneAuthor', respPhoneAuthor)

                     dispatch(putNewUserDataAction(respPhoneAuthor))


                 })
    
    
            })






        })
    }
}


//usage-----------
// const message = {
//     "lastOpenDate": new Date().toISOString() 
// }

// const url = '/privaterooms'

// props.putToBase(message, id, url)