import React from 'react'
import Header from '../header/Header'
import Menu from '../../../modules/Menu/Menu'
import MenuNew from '../../../modules/MenuNew/MenuNew';
import PrivateMessageContainer from './PrivateMessageContainer/PrivateMessageContainer'
import MyPrivateWhispModule from '../../../modules/MyPrivateWhispModule/MyPrivateWhispModule'
import MultiChatCover from './MultiChatCover/MultiChatCover'
import cl from './PrivateMessagePage.module.css'
import { useState, useEffect, useMemo  } from 'react'
import { connect } from 'react-redux'
import { get, filter, flatten } from 'lodash'
import { getUserDictAPI } from '../../../API/getUserDictAPI'
import { getPrivateRoomsAPI } from '../../../API/getPrivateRoomsAPI'
import { getPrivateMessagesAPI } from '../../../API/getPrivateMessagesAPI'
import { postRoomAPI } from '../../../API/postPrivateRoomAPI'
import { putToBaseAPI } from '../../../API/putToBaseAPI'
import { deleteFromBaseAPI } from '../../../API/deleteFromBaseAPI'
import { 
    getUsersDict, 
    getUserRoom, 
    getPutToBaseResult, 
    getDeleteFromBaseResult,
    getWs,
    getPostToBaseResult,
} from  '../../../redux/Selectors/baseSelectors'
import { 
    getPrivateRooms, 
    getAnotherChatMatesID, 
    getPrivateMessages, 
    getAnotherChatMatesMultyUsersID, 
} from '../../../redux/Selectors/privateRoomsSelector'
import { filterQuery } from '../../../services/filterQuery'
import { 
    sortBy, 
    last, 
    pick,
    map,
} from 'lodash'
import MyModal from '../../../UI/MyModal/MyModal'
import MyButton from '../../../UI/MyButton/MyButton'
import input from '../../../UI/MyInput/MyInput'
import { getMultyUsersRoomNameFromIndexesService } from '../../../services/roomNamesService'
import { postToBaseAPI } from '../../../API/postToBaseAPI'
import MyInput from '../../../UI/MyInput/MyInput'
import MySelect from '../../../UI/Myselect/MySelect'
import MyRedButton from '../../../UI/MyRedButton/MyRedButton'
import axios from 'axios'
import { appendScript } from '../../../services/webPushService/appendScript'
// import { push } from '../../../services/webPushService/push'
// import ScriptTag from 'react-script-tag';

function PrivateMessagePage(props) {
    
    const [usersDict, setUsersDict] = useState([])
    const [userID, setUserID] = useState()
    const [usersPrivateMessages, setUsersPrivateMessages] = useState()
    const [replyPrivateMessage, setReplyPrivateMessage] = useState('')
    const [listUsers, setListUsers] = useState()
    const [possibleDeleteChats, setPossibleDeleteChats] = useState()
    const [multyChatToDelete, setMultyChatToDelete] = useState()



  
    useEffect(()=>{
        props.getUsersDict()

    },[])

    useEffect(()=>{
        setUsersDict(props.usersDict)
        setUserID(get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id']))
        setListUsers(props.usersDict.map(user => pick(user, ['id', 'username'])))
    },[props.usersDict])


    useEffect(()=>{
        if (userID){
            props.getPrivateRooms(userID)
        }
    },[userID])




//тут мы получаем полный список сообщений, которые для юзера, деленный по комнатам.
// создаем чаты которые можно удалить
    useEffect(()=>{
        props.getPrivateMessages(props.usersPrivateRooms)
        console.log('teeee', props.usersPrivateRooms)

        const delChats = props.usersPrivateRooms.filter(chat => chat.privateChat == false)
        setPossibleDeleteChats(delChats)
        console.log('newChats', delChats)
    },[props.usersPrivateRooms])




    //передаем мессаджи юзера
    useEffect(()=>{
      setUsersPrivateMessages(flatten(props.privateMessages))  
    },[props.privateMessages])

    
    /// TODO Ниже сделать селектором для вывода сообщения


    function getLastMessage(roomID){
        const roomsMessages = flatten(props.privateMessages)
        const filteredByAuthor = filter(roomsMessages, {'privateRoom':roomID}).filter(post => post.author !== userID)
        const filterdAndSorted = sortBy(filteredByAuthor, ['create_at'])
        const roomDate = get(filter(props.usersPrivateRooms, {'id': roomID}),[0,'lastOpenDate'])
        const newDateFilter = filterdAndSorted.filter(date => {
            return date.create_at > roomDate
        })
        const lastFileteredAndSorted = get(last(filterdAndSorted),['text'])
        console.log('test date', lastFileteredAndSorted)
        return lastFileteredAndSorted
    }

    // код ревью: 
    //  получаем все мессаджи 
    //  фильтруем на мессаджи, которые не автора. 
    //  сортируем их по дате.
    //  получаем дату последнего захода в комнату
    //  филтруем и возвращаем список мессаджей не автора после даты последнего захода
    //  возвращаем длинну (это будет кол во сообщений)

    function getNumberNewMessages(roomID){
        const roomsMessages = flatten(props.privateMessages)
        const filteredByAuthor = filter(roomsMessages, {'privateRoom':roomID}).filter(post => post.author !== userID)
        const filterdAndSorted = sortBy(filteredByAuthor, ['create_at'])

        const roomDate = get(filter(props.usersPrivateRooms, {'id': roomID}),[0,'lastOpenDate'])
        const newDateFilter = filterdAndSorted.filter(date => {
            return date.create_at > roomDate
        }) 
        return newDateFilter.length
    }
 

    // ф-ция отвечает за ответ юзеру 
//========================REPLY

    function privateReply(roomID, newReplyMessage){
        setUsersPrivateMessages([...usersPrivateMessages, newReplyMessage])
        setReplyPrivateMessage('')
    }

    //===============with QUOTATION
    function privateReplWithQoutation(user, text, date, userReply){
        const quote = {
            user: user,
            text: text,
            date: convertedFullDate(date),
        }

        let additionWithReplyPost = {
                    id: new Date().toISOString(), 
                    create_at: new Date().toISOString(), 
                    author:  filter(props.usersDict, {'username': localStorage.getItem('SLNUserName')})[0].id, 
                    quote: quote,
                    text: userReply
                }
        setUsersPrivateMessages([ ...usersPrivateMessages, additionWithReplyPost]) 
        setReplyPrivateMessage('')  
    }

//-===========================Delete++====================
    function privateMessageDelete(id){
        setUsersPrivateMessages(usersPrivateMessages.filter(message => message.id !== id))

        const url = '/prvatemessages'
        props.deleteFromBase(id, url)
        
    }

    useEffect(()=>{
        console.log('props.deleteFromBaseResult', props.deleteFromBaseResult)
    },[props.deleteFromBaseResult])



    //EDIT ++========================================
    function privateMessageEdit(id, text){
        const editedMessage = filter(usersPrivateMessages, {id:id})
        editedMessage[0].text = text

        const url = '/prvatemessages'
        const message = {
            "text": text,
        }
        props.putToBase(message, url, id)
    }

    useEffect(()=>{
        console.log('props.putToBaseResult', props.putToBaseResult)
    },[props.putToBaseResult])


        // Блок фильтрации юзеров//////////////////////////////////////////
        const [searchQuery, setSearchQuery] = useState('')
        const [filteredUsers, setFilteredUsers] = useState()
        const [filteredChats, setFilteredChats] = useState([1])
        function checkTheInput(event){
            setSearchQuery(event.target.value)
        }
//-------юзеры внизу
        const filteredUsersProcess = useMemo(()=>{
            return filterQuery(listUsers, searchQuery)
        },[listUsers, searchQuery])

        useEffect(()=>{
            if (filteredUsersProcess){
                setFilteredUsers(filteredUsersProcess.filter(user => (
                    user.username !== localStorage.getItem('SLNUserName') 
                 && user.username.slice(0,7) !== 'empty16'
                    )
                ))
            }
        },[filteredUsersProcess])

/// -------чаты
        const filteredChatProcess = useMemo(()=>{
            return filterQuery(props.anotherChatMatesMultyUsersID, searchQuery)
        }, [props.anotherChatMatesMultyUsersID, searchQuery])

        useEffect(()=>{
            if (filteredChatProcess){
                setFilteredChats(filteredChatProcess)
            }
        },[filteredChatProcess])


        // ВСЕ
        // пишем личные сообщения найденным юзерам

        const [userForNewChat, setUserForNewChat] = useState()
        const [target, setTarget] = useState() // костыль ключ модалки, чтобы вызывалась только нужная
        const [privateModal, setPrivateModal] = useState(false)
        const [userPrivateRooms, setUserPrivateRooms] = useState()


        function callModalForPrivate(target, user){
            props.getPrivateRooms(user.id)
            setUserForNewChat(user.id)
        } 


        const [newChatModal, setNewChatModal] = useState(false)
        const [newChatName, setNewChatName] = useState('')
    
        const createChat = (e) => {
            e.preventDefault()
            // так получаем юзер айди
            console.log('hello world', userID)
            setNewChatModal(true)
  
            // делаем модалку с полями Имя чата и кнопкой ок
            // из этого делаем @MULTY_userId
            // вопрос что делать с именем группы. => добавил имя в группу. бланк. Юзаем для мульти чатов. Соотвественно, если оно есть -
            // выводим в чате где нить сверху

        }

        // action create chat
        const createChatAction = () => {
            console.log('create chate', 'user ID', userID, 'chat name', newChatName)
            setNewChatModal(false)
            const dboName = getMultyUsersRoomNameFromIndexesService([userID])
            console.log('aaa', dboName[0])

            // props.putToBase(message, id, url)

            let users = new Array;
            users.push(userID)

            const message =    {
                "privateChatName": dboName[0],
                "lastOpenDate": new Date().toISOString(),
                "privateChat": false,
                "name": newChatName,
                "privateRoomMembers": users
            }

            const url = '/privaterooms'
            props.postToBase(message, url)
        }

        useEffect(() => {
            if (props?.postToBaseResult?.status === 201){
                console.log('base Post Result', props?.postToBaseResult)
                window.location.reload()
                setNewChatName('')
            }
        },[props.postToBaseResult])

        //============================удаление чата


        const deleteChatAction = (e) => {
            e.preventDefault();
            console.log('DELETE', multyChatToDelete)

            const url = '/privaterooms'
            props.deleteFromBase(multyChatToDelete, url)
            
        }
    
        useEffect(()=>{
            console.log('props.deleteFromBaseResult', props.deleteFromBaseResult)
            if (multyChatToDelete && props.deleteFromBaseResult === 204){
                window.location.reload()
          }
        },[props.deleteFromBaseResult])


        useEffect(() => {
            addEventListener('load', async () => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker
                    .register('./sw.js')
                        // /sworker)
                    .then(resp =>{
                    })
                    .catch(e => console.log("EEEEERRRROR", e))  
                }
            })
        }, [])

        async function webPush(e) {
            e.preventDefault;
            console.log('good')
            let sw =  await navigator.serviceWorker.ready;
            console.log('1', sw)
            let push = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BHSmG74ohnQBTaew7auhHQTFAfV088ddMeu4A4h0rUHCzKJAlMAceYVamAKkOvWLzxR-S3vSlAQpjpmUpa7bmwk'
            })
            // console.log('tupo', push)
            // console.log(JSON.stringify(push))
        //     // window.localStorage.setItem('userWebPush', JSON.stringify(push))
        //     const body = {'head': '111', 'body': '222', 'id': '221'}
        //     const sss = axios.post('http://${BACKED_ADDRESS}/send_push/', body)
        //     sss.then(resp => {
        //         console.log('RESPONSE', resp)
        //     })
        //     sss.catch(e => console.log('ERRROR', e))
        }

        const makePush = (e) => {
            e.preventDefault();
            // window.push();
            // const script = document.createElement("script");
            // script.src = './push';
            // script.async = true;
            // document.body.appendChild(script);
            //appendScript("../../../services/webPushService/push.js");

            // if ('Notification' in window) {
            //     if (window.Notification.permission === 'granted') {
            //       new window.Notification('Вы получили новое сообщение!');
            //     }
            //   }
        }


    return (
        <>

            <MyModal
                visible={newChatModal}
                setVisible={setNewChatModal}
            >
               <MyInput
                    setNewChatName={setNewChatName}
                    newChatName={newChatName}
                    //onChange={e => setNewChatName(e.target.value)}
               
               /> 
               
               <MyButton
                    onClick={createChatAction}
                >
                    Создать новый чат
               </MyButton>


            </MyModal>
          

      


            {userForNewChat
            ?   <div>

                <MyPrivateWhispModule
                userForNewChat={userForNewChat}
                usersDict={props.usersDict}
                usersPrivateRooms={props.usersPrivateRooms}
                setUserForNewChat={setUserForNewChat}
                setUserPrivateRooms={setUserPrivateRooms}
                />  
                </div>
            :   <span></span>
            }
        <Header/>
        <MenuNew
        value={searchQuery}
        onChange={checkTheInput}
        placeholder='Поиск пользователя для отправки сообщений'
        />


        <div>
            <div className={cl.BaseLayer}>
                <div className={cl.BaseLine}>
                {/* <button
                onClick={e => webPush(e)}
                >subscribve</button>
                <p></p>
                <button
                onClick={e => makePush(e)}
                >
                    Make Push
                </button> */}

                    <div className={cl.PrivateChatsbtnGrp}>
                        <MyButton
                            onClick={e => createChat(e)} 
                        >Создать групповой чат</MyButton>


                        <select
                            onChange={e => setMultyChatToDelete(e.target.value)}
                        >
                        <option  value="">Выберите группой чат для удаления</option> 
                            {possibleDeleteChats?.map(room => 
                                    <option key={room.id}
                                    value={room.id}
                                    >
                                    {room.name} 
                                    </option>
                                )}
                        </select>

                            
                        <MyRedButton
                            onClick={e => deleteChatAction(e)}
                            > Удалить </MyRedButton>
                    </div>

                    <div className={cl.MessagesLayer}>
                        <div>
                            <p>Добрый день</p>
                        </div>
                        <div className={cl.MessagesContainer}>
                             {filteredChats !== undefined && usersDict
                            ?   map(sortBy(filteredChats, ['privateChat']), messageRoom =>
                                // sortBy(props.anotherChatMatesMultyUsersID, ['privateChat'])
                                        messageRoom.privateChat
                                            ? 
                                                <PrivateMessageContainer 
                                                    key={messageRoom.privateChatID}
                                                    messages={usersPrivateMessages}
                                                    ID={messageRoom.privateChatID}
                                                    user={filter(usersDict, {'id':messageRoom.anotherChatMate[0]})[0]?.username}
                                                    avatar={filter(usersDict, {'id':messageRoom.anotherChatMate[0]})[0]?.avatar}
                                                    text={
                                                        getLastMessage(messageRoom.privateChatID)  
                                                        ? getLastMessage(messageRoom.privateChatID)
                                                        : <p></p>
                                                    }
                                                    newMessages={getNumberNewMessages(messageRoom.privateChatID)}
                                                    usersDict={props.usersDict}
                                                    privateReply={privateReply}
                                                    setReplyPrivate={setReplyPrivateMessage}
                                                    replyPrivateMessage={replyPrivateMessage}
                                                    replyPrivateQithQuotation={privateReplWithQoutation}
                                                    privateMessageDelete={privateMessageDelete}
                                                    privateMessageEdit={privateMessageEdit}
                                                    userForNewChat={userForNewChat}
                                                    userID={userID}
                                                    target={target}
                                                    setPrivateModal={setPrivateModal}
                                                    privateModal={privateModal}
                                                    roomName={get(filter(props.usersPrivateRooms, {'id': messageRoom.privateChatID}),[0, 'privateChatName'])}
                                                    
                                                    />
   
                                            :   <MultiChatCover
                                                    key={messageRoom.privateChatID}
                                                    messages={usersPrivateMessages}
                                                    messageRoom={messageRoom}
                                                    ID={messageRoom.privateChatID}
                                                    usersArray={messageRoom.anotherChatMate}
                                                    usersDict={props.usersDict}
                                                    text={
                                                        getLastMessage(messageRoom.privateChatID)  
                                                        ? getLastMessage(messageRoom.privateChatID)
                                                        : <p></p>
                                                    }
                                                    newMessages={getNumberNewMessages(messageRoom.privateChatID)}
                                                    replyPrivateMessage={replyPrivateMessage}
                                                    replyPrivateQithQuotation={privateReplWithQoutation}
                                                    privateReply={privateReply}
                                                    setReplyPrivate={setReplyPrivateMessage}
                                                    privateMessageDelete={privateMessageDelete}
                                                    privateMessageEdit={privateMessageEdit}
                                                    isMultipyChat={true}
                                                    filteredUsers={filteredUsers}
                                                    usersPrivateRooms={props.usersPrivateRooms}
                                                    userID={userID}
                                                    roomName={get(filter(props.usersPrivateRooms, {'id': messageRoom.privateChatID}),[0, 'privateChatName'])}
                                                    name={get(filter(props.usersPrivateRooms, {'id': messageRoom.privateChatID}),[0, 'name'])}
                                                    putToBase={props.putToBase}
                                                    putToBaseResult={props.putToBaseResult}
                                                    
                                                    /> 
                                    )
                            : <p></p>
                            } 
                        </div>
                    </div>

                    <div className={cl.userList}>
                        <div className={cl.MessagesLayer}>
                            <h5>Список пользователей, зарегистрированных на портале</h5>
                                { filteredUsers
                                ?   filteredUsers.map(user =>
                                        <span
                                            className={cl.userName}
                                            key={user.id}
                                        >
                                            <span
                                                onClick={(e) => callModalForPrivate(e.target, user)}
                                                value={user.username}
                                                
                                            >{user.username}, </span>
                                        </span>
                                    )
                                : <p>Ожидаем информацию по пользователям.</p>
                                }

                        </div>
                    </div>

                </div>
            </div>

        </div>
        </>
    )
}




export default connect(
    //mapStateToProps
    state => ({
        usersDict: getUsersDict(state),
        usersPrivateRooms: getPrivateRooms(state),
        anotherChatMatesList: getAnotherChatMatesID(state),
        anotherChatMatesMultyUsersID: getAnotherChatMatesMultyUsersID(state),
        privateMessages: getPrivateMessages(state),
        userRoom: getUserRoom(state),
        putToBaseResult: getPutToBaseResult(state),
        deleteFromBaseResult: getDeleteFromBaseResult(state),
        Ws: getWs(state),
        postToBaseResult: getPostToBaseResult(state),
    }),
    //mapDispatchToProps
    dispatch => ({
        getUsersDict: () => {
            dispatch(getUserDictAPI())
        },
        getPrivateRooms: (value) => {
            dispatch(getPrivateRoomsAPI(value))
        },
        getPrivateMessages: (value) => {
            dispatch(getPrivateMessagesAPI(value))
        },
        postPrivateRoom: (value) => {
            dispatch(postRoomAPI(value))
        },
        putToBase: (value, url, id) => {
            dispatch(putToBaseAPI(value, url, id))
        },
        deleteFromBase: (id, url) => {
            dispatch(deleteFromBaseAPI(id, url))
        },
        postToBase: (id, url) => {
            dispatch(postToBaseAPI(id, url))
        },
    })

)(PrivateMessagePage)