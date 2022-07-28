import React, { useEffect, useRef } from 'react'
import cl from './MultiChatCover.module.css'
import { 
    get, 
    filter, 
    sortBy, 
    includes, 
    lowerCase, 
    toNumber,
    without,
    map,
    uniq
} from 'lodash'
import MyModalChat from '../PrivateMessageContainer/ModalChat/ModalChat'
import CommentInput from '../../../../components/pages/commentOutput/CommentInput/CommentInput'
import { useState } from 'react'
import MyModalChatContainer from '../PrivateMessageContainer/ModalChat/MyModalChatContainer/MyModalChatContainer'
import { getIndexesFromMultyUsersRoomNameService, getMultyUsersRoomNameFromIndexesService } from '../../../../services/roomNamesService'
import CommentInputRef from '../../../../modules/CommentInputRef/CommentInputRef'
import { BACKED_ADDRESS } from  '../../../../constants/constants' 

function _MultiChatCover({
    usersDict, 
    user, 
    text, 
    newMessages, 
    messages, 
    usersArray,
    setReplyPrivate, 
    replyPrivateMessage, 
    privateReply, 
    privateMessageDelete, 
    privateMessageEdit,
    filteredUsers,
    ID, 
    userID,
    roomName,
    putToBase,
    putToBaseResult,
    name,
    ...props}) {




    const [modal, setModal] = useState(false)
    const [replyPrivateWithQuotation, setReplyPrivateWithQuotation] = useState(true)
    const [groupMembers, setGroupMembers] = useState()
    const [notGroupMembers, setNotGroupMembers] = useState()
    const [wss, setWss] = useState(null)
    const [wsIncomeMessage, setWsIncomeMessage] = useState()
    const replyBodyRef = useRef(); 
    const [multyUsersArray, setMultyUsersArray] = useState(usersArray)



    function startChat(id){
        let groupMembers = []
        let notGroupMembers = []
        map(filteredUsers, user => {
            if (includes(usersArray, user.id)){
                groupMembers.push(user)
            } else {
                notGroupMembers.push(user)
            }
        })
        setGroupMembers(sortBy(groupMembers, lowerCase(['username'])))
        setNotGroupMembers(sortBy(notGroupMembers, lowerCase(['username'])))
        setModal(true)
// web sockets initialize here

        console.log('name', name)
        const ws = new WebSocket(`ws://${BACKED_ADDRESS}/api/prvatemessages/`)
        setWss(ws)
            ws.onopen = () => {
                console.log('connected')
                }
            ws.onmessage = evt => {
                setWsIncomeMessage(evt.data)

            }
            ws.onclose = () => {
                console.log('disconnected')
            }
    }

    useEffect(()=>{
        if (wsIncomeMessage){
            if (userID !== JSON.parse(wsIncomeMessage).user) {
                if ('Notification' in window) {
                    if (window.Notification.permission === 'granted') {
                        new window.Notification(`Вы получили новое сообщение от ${get(filter(usersDict, {'id': JSON.parse(wsIncomeMessage).user}),[0, 'username'])}: ${JSON.parse(wsIncomeMessage).text}`);
                    }
                }
            }
            console.log('tesst', JSON.parse(wsIncomeMessage))

            const newReplyMessage = JSON.parse(wsIncomeMessage);
            privateReply(ID, newReplyMessage) 
            replyBodyRef.current.value = ''
        }
    },[wsIncomeMessage])


    function ReplyPrivateTransition(e){
        e.preventDefault()
        const newPrivateMessage = {
            id: new Date().toISOString(), 
            create_at: new Date().toISOString(), 
            user: userID,
            author: userID,
            privateRoom: ID,
            text: replyBodyRef.current.value
            }        

        try {

            wss.send(JSON.stringify(newPrivateMessage)) //send data to the server
        }catch (error) {
            console.log(error) // catch error
        }
    }


    function addUserChange(usersArray, value){
        console.log('222222222222', usersArray)

        if ([...usersArray, toNumber(value)].length < 10) {
            const rez = getMultyUsersRoomNameFromIndexesService([...usersArray, toNumber(value), get(filter(usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id'])])
            if (usersArray) {
                console.log('before enrich! newRoomMembers', usersArray, value)
            }
            const [newRoomName, newRoomMembers] = rez
            let newRoomMembersArray = new Array;
            newRoomMembers.map(user =>{
                newRoomMembersArray.push(user)
            })  

            console.log('TEST USER ARRAY', newRoomMembers)
            const payload = {
                "privateChatName": newRoomName,
                "privateRoomMembers": newRoomMembersArray
            }
            const url = '/privaterooms'
           putToBase(payload, url, ID)

           setMultyUsersArray(newRoomMembers)
           console.log('payllll', payload)

           //const newGroupMembers = groupMembers.push(notGroupMembers[0])
           // setGroupMembers(groupMembers)

           //const testDelete = notGroupMembers.filter(i => i.name)
        
           // доделать ай ди добавлять и удалять из нот мемберов. при удалении наоборт


           const newMember = filteredUsers.filter(({id}) => id === toNumber(value))
           const newNotGroupMembers = notGroupMembers.filter(({id}) => id !== toNumber(value))     

           setGroupMembers([...groupMembers, newMember[0]])
           setNotGroupMembers(newNotGroupMembers)

        } else {
            window.alert('Вы превысили максимальное значение пользователей в комнате. Максимальное количество 10 человек')
        }
    }

    function removeUserChange(userToRemoveId){
        const groupMembersLocal = getIndexesFromMultyUsersRoomNameService(roomName, ID)
        //const groupMembersLocal = multyUsersArray
        const newRoomMembers = without(groupMembersLocal, userToRemoveId)
        const newRoomName = getMultyUsersRoomNameFromIndexesService(newRoomMembers)
        let newRoomMembersArray = new Array;
        newRoomMembers.map(user =>{
            newRoomMembersArray.push(user)
        })   

        const payload = {
            "privateChatName": newRoomName[0],
            "privateRoomMembers": newRoomMembersArray
        }
        const url = '/privaterooms'
        putToBase(payload, url, ID)

        
       

        const removeMember = filteredUsers.filter(({id}) => id === toNumber(userToRemoveId))

        const newGroupMembers = groupMembers.filter(({id}) => id !== toNumber(userToRemoveId))

        setGroupMembers(newGroupMembers)
      //  setMultyUsersArray(newGroupMembers)

        setNotGroupMembers([...notGroupMembers, removeMember[0]])
    }
        useEffect(()=>{
            if (putToBaseResult === 200){
               // window.location.reload();
            }
        },[putToBaseResult])

        // этим эффектом рвем сокет соединение, т.к вышли из чат рум
        useEffect(()=> {
            if (!modal && wss){
                wss.close()
                setWss(null)
                window.location.reload()
            }
            

        }, [modal])
    

    return (
        <>

        <MyModalChat
            visible={modal}
            setVisible={setModal}
            >

            {sortBy(filter(messages, {'privateRoom':ID}),['create_at']).map(message=>
                <MyModalChatContainer
                    key={message.id}
                    user={user}
                    roomMessage={message}
                    create_at={message.create_at}
                    roomID={ID}
                    avatar={get(filter(usersDict, {'username': user}),[0, 'avatar'])}
                    author={message.author}
                    privateMessageDelete={privateMessageDelete}
                    privateMessageEdit={privateMessageEdit}
                    replyPrivateWithQuotation={replyPrivateWithQuotation}
                    name={name}
                    

                />
            )}

                <CommentInputRef
                    //value={replyPrivateMessage}
                    onChange={e => setReplyPrivate(e.target.value)}
                    onClick={e => ReplyPrivateTransition(e)}
                    isMultipyChat={true}
                    addUserChange={addUserChange}
                    removeUserChange={removeUserChange}
                    groupMembers={groupMembers}
                    notGroupMembers={notGroupMembers}
                    //usersArray={usersArray}
                    usersArray={multyUsersArray}
                    ref={replyBodyRef}
                />
        </MyModalChat>



        <div
            onClick={e => startChat(ID)} 
            className={cl.Container}>
            
            {
                name
                ? <span className={cl.MultyChatName}>{name}</span>
                : <span className={cl.MultyChatName}>Групповой чат</span>
            
            }
            
                
            <div className={cl.userInfo}>
                {map(usersArray, chatMember =>
                    <div 
                        key={chatMember}
                        className={cl.userInfoCell} 
                    >
                        {get(filter(usersDict, {'author': chatMember}), ['0', 'avatar']) 
                                ? <span> <img src={get(filter(usersDict, {'author': chatMember}), ['0', 'avatar']) } alt='avatar'/></span>
                                : <span> <img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='avatar'/></span>
                            }
                    </div>
                )}
            </div>
            <div className={cl.textInfo}>
                <div className={cl.cuttedText}>
                </div>
                <div 
                onClick={startChat}>
                    {newMessages
                    ?  <span style={{fontWeight:'bold'}}>Новых сообщений: {newMessages}</span>
                    :  <span>Нет новых сообщений</span>
                    }
                </div>
            </div>
        </div>   
        </>
    )
}

const MultiChatCover = React.memo(_MultiChatCover)
export default MultiChatCover
