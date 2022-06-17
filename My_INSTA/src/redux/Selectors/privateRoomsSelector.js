import { createSelector } from "reselect"
import { filter, get, difference, remove, flatten } from 'lodash'
import { store } from '../reducers/index'


export const getUsersDict = (state) => {
    return state.usersDict || []
} 

export const getPrivateRooms = (state) => {
        return state?.getPrivateRooms || []
  
} 

export const getActualUserInfo = createSelector(
    getUsersDict,
    (usersDict) => {
        const actualUserName = filter(usersDict, {'username':localStorage.getItem('SLNUserName')})
        return actualUserName 
    }
)


export const getAnotherChatMatesID = createSelector(
    getPrivateRooms, 
    getActualUserInfo,
    getUsersDict,
    (
    users,
    actualUser,
    usersDict
    ) => {

        const anotherChatMatesID = []
        users.map(user => {
            const userId = difference(get(user, ['privateRoomMembers']), [get(actualUser, [0, 'id'])])[0]
            anotherChatMatesID.push(
                {
                    'privateChatID': user.id, 
                    'anotherChatMate': difference(get(user, ['privateRoomMembers']), [get(actualUser, [0, 'id'])])[0],
                    'privateChat': user.privateChat,
                    'userName': filter(usersDict, {'id':userId})[0]?.username
                })
        })

        return anotherChatMatesID    
    }
  )

// Селектор получает других мемберов данной комнаты для мульти чата
export const getAnotherChatMatesMultyUsersID = createSelector(
    getPrivateRooms, 
    getActualUserInfo,
    getUsersDict,
    (
    users,
    actualUser,
    usersDict
    ) => {
        const anotherChatMatesID = []
        users.map(user => {
            const userId = difference(get(user, ['privateRoomMembers']), [get(actualUser, [0, 'id'])])[0]
            anotherChatMatesID.push(
                {
                    'privateChatID': user.id, 
                    'anotherChatMate': difference(get(user, ['privateRoomMembers']), [get(actualUser, [0, 'id'])]),
                    'privateChat': user.privateChat,
                    'username': filter(usersDict, {'id':userId})[0]?.username
                })
        })
        return anotherChatMatesID    
    }
  )




// export const getActualChatRoomName = createSelector(
//     getPrivateRooms,

//     (privateRoomInfo) => {

//         console.log('privateRoomInfo', privateRoomInfo)
//     }

// )

  

//TODO нормализовать имена групп хорошобы написать селектор, где бы на основании данных из групп погружались бы данные по чатам.


export const getPrivateMessages = (state) => {
    if (state){
        return state.privateRoomMessages || []
    }
} 

export const getPrivateMessageByRoomID = (state, ID) => {
    const allMessagesArray = state.privateRoomMessages
    const roomID = ID

    console.log('test allmessages', allMessagesArray)
    console.log('ID', roomID)
    const filtererPickedRoomID = allMessagesArray.map(rooms => {
        console.log('here2', get(rooms, ['privateRoom']))
        if (get(rooms, ['privateRoom']) === roomID){
            console.log('here', rooms)
                return rooms
            }

        })


        return flatten(remove(allMessagesArray.map(rooms => {
            if (get(rooms, ['privateRoom']) === roomID){
                    return rooms
                }
    
            }), undefined))
            
           //(flatten(remove(filtererPickedRoomID, undefined))) 

}


// export const getPrivateMessageByRoomID = createSelector(
//     getPrivateMessages,
//     (allMessagesArray
//         )=> {
            

           
//             const roomID = 1
//             const filtererPickedRoomID = allMessagesArray.map(rooms => {
//                     console.log('rrrrr', rooms)
//                     console.log('222222', get(rooms, [0, 'id']))
//                     if (get(rooms, [0, 'id']) === roomID){
//                         return rooms
//                     }
//             })

//          //console.log('filtererPickedRoomID', filtererPickedRoomID.filter(romm => romm !== undefined))
//          //console.log('123', flatten(remove(filtererPickedRoomID, undefined)))
//             return flatten(remove(filtererPickedRoomID, undefined))  
//          //   return   filtererPickedRoomID.filter(romm => romm !== undefined)    
//         }
// )