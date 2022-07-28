import React, { useState } from 'react'
import MyModal from '../../../../../UI/MyModal/MyModal'
import MyButton from '../../../../../UI/MyButton/MyButton'
import axios from 'axios'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { 
    setIsEmailConfirmedAction,
    setIsPhoneConformedAction
} from '../../../../../redux/ActionCreators'
import { store } from '../../../../../redux/reducers/index'
import { BACKED_ADDRESS } from '../../../../../constants/constants'
export default function PhoneConfirmationStep(
    {
        user,
        confirmPhoneModal, 
        setConfirmPhoneModal,
        newChatName,
        ...props
    }
) {
    const [confirmPhoneModal2, setConfirmPhoneModal2] = useState(confirmPhoneModal)
    const [smsCodeToConfirm, setSmsCodeToConfirm] = useState('')
    const [wrongSmsCode, setWrongSmsCode] = useState(false)

    const dispatch = useDispatch()


    useEffect(() => {
        setConfirmPhoneModal2(confirmPhoneModal) 
    },[confirmPhoneModal])
    const checkCode = (e) => {
        e.preventDefault();

        axios.get(`http://${BACKED_ADDRESS}/api/author/${user.authorID}`)
            .then(resp => {

                if (get(resp.data, ['phoneConfirmationCode']) == smsCodeToConfirm){
                    // setSmsCodeToConfirm('')
                    setConfirmPhoneModal(false)
                    
                    const message = {
                        "isPhoneConformed": true 
                    }
                    const url = '/author'

                    const putMessage = axios.patch(`http://${BACKED_ADDRESS}/api${url}/${user.authorID}/`, message);
                    putMessage.then(resp2 => {
                         dispatch(setIsPhoneConformedAction(true))
                         console.log('resp', resp2)
                         console.log('store', store.getState())
                     })
                } else {
                    setWrongSmsCode(true)

                }
            })
    }


  return (
    <MyModal
        visible={confirmPhoneModal}
        setVisible={setConfirmPhoneModal}
        style={{width:'30%'}}
    >
        Введите полученный в СМС код
        { wrongSmsCode 
        ? <p style={{color:'red'}}>Вы ввели не верный код</p>
        : <p></p>
        }
        <input
            newChatName={newChatName}
            onChange={e => setSmsCodeToConfirm(e.target.value)}
            style={{width:'30%'}}
        
        />
        <MyButton
            style={{marginTop:'2rem'}}
            onClick={e => checkCode(e)}
        
        >Подтвердить</MyButton>


    </MyModal>
  )
}
