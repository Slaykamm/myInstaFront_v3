import { createEmptyUserAction } from "../redux/actions/createEmptyUserAction";
import axios from "axios";
import { get } from 'lodash'
import { BACKED_ADDRESS } from "../constants/constants";


//ф--------------функция для асинхронного запроса
export const createNewUserAPI  = () => {
    return function(dispatch) {

        
        const user = {
            "username": `empty${Date.now()}`,
            "password1":"qwe+12345",
            "password2":"qwe+12345",
            "email":`empty${Date.now()}@mail.ru`
        }

        console.log('step1: user', user)
        const creatUser = axios.post(`http://${BACKED_ADDRESS}/auth/registration/`, user)

        creatUser.then(resp => {

            console.log('step2: create user result', resp)
            const getId = axios.get(`http://${BACKED_ADDRESS}/api/users/?username=${user.username}`)

            getId.then(respID =>{
                console.log('respID', respID)
                const id = get(respID, ['data', '0', 'id'])
                console.log('step3: new user ID', respID)

                const author = {
                   // "avatar": null,
                    "phone": `${Date.now()}`,
                    "name": id
                }
                getId.catch((err) => {
                    console.log('ERRROR  ID', err.response)

                })

                console.log('step4: new author ', author)
                const makeAuthor = axios.post(`http://${BACKED_ADDRESS}/api/author/`, author)

                makeAuthor.then(newAuthorResp => {
                    console.log('step4: new author ', newAuthorResp)
                        const enrichedResult = {...newAuthorResp, ...resp.data}
                        dispatch(createEmptyUserAction(enrichedResult))
                })

                makeAuthor.catch((err) => {
                    console.log('ERRROR AUTHOR', err.response)
                   // dispatch(verifyUserAction(err.response))

                })

            })
        })
    }
}
