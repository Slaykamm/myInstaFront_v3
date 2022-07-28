import React from 'react'
import cl from './MyModalChatContainer.module.css'
import { get, filter } from 'lodash'
import { convertedFullDate } from '../../../../../../services/dataConverter'
import DropDown from '../../../../../../UI/DropDown/DropDown'
import { useState } from 'react'
import MyModal from '../../../../../../UI/MyModal/MyModal'
import CommentInput from '../../../../commentOutput/CommentInput/CommentInput'
import {BACKED_ADDRESS} from '../../../../../../constants/constants'

function MyModalChatContainer(
    {
        privateMessageEdit, 
        privateMessageDelete, 
        author, 
        create_at, 
        avatar, 
        user, 
        roomMessage, 
        roomID, 
        replyPrivateWithQuotation, 
        name,
        ...props
    }) {
    const [modal, setModal] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [editMessage, setEditMessage] = useState(roomMessage.text)

    const usersDict = JSON.parse(window.localStorage.getItem('usersDict')) 



    function EditTransition(e){
        e.preventDefault();
        setModalEdit(false)
        privateMessageEdit(roomMessage.id, editMessage)
    }

    function DeleteTransition(e){
        e.preventDefault();
        privateMessageDelete(roomMessage.id)
    }
    //console.log('MyModalChatContainer rendered')
    return (
        <>
                <div className={cl.commentContainer}>
                    <div className={cl.userInfo}>
                        <div >
                            {get(filter(usersDict, {'author': author}),[0,'avatar']) 
                            ? <span> <img style={{height:'50px'}} src={get(filter(usersDict, {'author': author}),[0,'avatar'])}/></span>
                            : <span><img style={{height:'50px'}} src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='avatar'/></span>
                        }
                        </div>
                        <div>
                            <span>{get(filter(usersDict, {'author': author}),[0,'username'])}</span>  
                                              
                        </div>
                </div>

                <div className={cl.Context}>
                    <div className={cl.postDate}>Опубликовано: {convertedFullDate(create_at)}</div>
                    <div><span>{roomMessage.text}</span></div>
                    <p></p>
                </div>

                <div className={cl.ButtonCollection}>
                
                    { localStorage.getItem('SLNUserName') === get(filter(usersDict, {'author': author}),[0,'username'])
                        ?
                            <DropDown
                                setModal={setModal}
                                setModalEdit={setModalEdit}
                                user={get(filter(usersDict, {'author': author}),[0,'username'])}
                                id={roomID}
                                privatwsageEdit={EditTransition}
                                commentDelete={DeleteTransition}
                                commentPrivateMessege={null}
                                replyPrivateWithQuotation={replyPrivateWithQuotation}
                            />
                        : <span></span>
                    }
                </div>

                {/* модалка для того, чтобы по редактировать сообщения в чате */}
                <MyModal
                visible={modalEdit}
                setVisible={setModalEdit}
                >
                    <CommentInput
                        value={editMessage}
                        onChange={e => setEditMessage(e.target.value)}
                        onClick={e => EditTransition(e)}
                    // onClickCancel={setModalEdit(false)}
                    />
                </MyModal>
            </div>        


        </>
    )
}

export default MyModalChatContainer
