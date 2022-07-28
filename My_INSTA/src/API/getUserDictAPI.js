import axios from "axios";
import { getUserDictionary } from "../redux/ActionCreators";
import { filter, forEach, map, omit } from 'lodash'
import { BACKED_ADDRESS } from "../constants/constants";
//ф--------------функция для асинхронного запроса
export const getUserDictAPI  = () => {
    return function(dispatch) {
        const authorDictAPI = axios.get(`http://${BACKED_ADDRESS}/api/author/`);
        authorDictAPI.then(respAuthor => {  //получаем всех авторов (аватары и телефоны) связь по pk юзера
            const userDictAPI = axios.get(`http://${BACKED_ADDRESS}/api/users/`);
            userDictAPI.then(respUser =>{  // получаем всех узеров. 
                const securedUSerDict = []
                forEach(respUser.data, function(value)  {
                    let securedValue = omit(value, ['password', 'is_superuser', 'is_staff', 'groups', 'user_permissions'])
                    securedUSerDict.push(securedValue) // получили тут юзеров без вышеозначенных полей (для безопасности)
                })
                const users = [];
                securedUSerDict.map(user => {     // мапим по юзерам
                    const ava = filter(respAuthor.data, {'name':user.id})  // получаем записаь из автора с юзер айди 
                        if (ava.length){
                            users.push(
                                {
                                    ...user,
                                    ...{
                                        avatar: ava[0].avatar, 
                                        phone: ava[0].phone, 
                                        socialAcc: ava[0].socialAcc,
                                        author: ava[0].name, 
                                        userID: ava[0].id,
                                        isEmailConfirmed: ava[0].isEmailConfirmed,
                                        isPhoneConformed: ava[0].isPhoneConformed,
                                    }
                                }
                            )  // если есть тогда присоеднием к юзерам аватар и телефон
                        }
                        else {
                            users.push({...user,...{avatar: null, phone: null, author: null, userID: ava[0]?.id}}) // если записей  - тогда просто нули пишем.
                        }
                    }
                )
                dispatch(getUserDictionary(users))   // диспатчим словарь
            })
        })
    }
}


