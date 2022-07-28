import React from 'react'
import { useState } from 'react'
import cl from './RegistrationForm.module.css'
import { Field } from 'redux-form'
import MyInput from '../../../../modules/UserCabinet/MyInput/MyInput'
//import MyInput from './MyInput/MyInput'
import MyButton from '../../../../UI/MyButton/MyButton'
import PhoneConfirmationStep from './phoneConfirmationStep/PhoneConfirmationStep'
import { emailSybmolsValidate, loginSybmolsValidate, passwordSymbolsValidate, phoneSybmolsValidate, requiredField } from '../../../../modules/WelcomePage/LoginForm/Validators/validatorsLogin'
import axios from 'axios'
import { store } from '../../../../redux/reducers/index'
import { get } from 'lodash'

import { 
    getEmailFromFormValues,
    getPhoneFromFormValues
} from '../../../../redux/Selectors/welcomePageSelectors'
import { useSelector } from "react-redux"
import MyModal from '../../../../UI/MyModal/MyModal'
import { createSelector } from 'reselect'
import { useDispatch } from 'react-redux'
import { setIsEmailConfirmedAction } from '../../../../redux/ActionCreators'
import { getIsRegistrationButtonEnabled } from '../../../../redux/Selectors/welcomePageSelectors';
import { BACKED_ADDRESS } from '../../../../constants/constants'

function RegistrationForm(
    {
        user, 
        newChatName,
        ...props
    }) {

    const isRegistrationButtonEnable = useSelector(getIsRegistrationButtonEnabled)
    const [confirmPhoneModal, setConfirmPhoneModal] = useState(false)


    const userEmail = useSelector(getEmailFromFormValues)

    const dispatch = useDispatch()
    function regEmailButtonHandle(event) {
        event.preventDefault();

        axios.get(`http://${BACKED_ADDRESS}/api/auth/emailverify/?id=${user.userID}&author=${user.authorID}&email=${userEmail}`)
        .then(res => {
            console.log('put to storage', res)
            dispatch(setIsEmailConfirmedAction(true))


        })
    }



    const userPhone = useSelector(getPhoneFromFormValues)

    function regPhoneButtonHandle(event) {
        event.preventDefault();
        console.log('state', userPhone)
        const body = {
            number: userPhone,
            userId: user.userID,
            authorId: user.authorID
          }

        
        //TODO vinesty v thunk
        axios.post(`http://${BACKED_ADDRESS}/send_otp/`, body)
        .then(resp => {
            console.log('confimration phone number', resp.data)
            
        })
        setConfirmPhoneModal(true)
    }   




    
    return (
        <>
            <PhoneConfirmationStep
                user={user}
                putToBase={props.putToBase}
                confirmPhoneModal={confirmPhoneModal} 
                setConfirmPhoneModal={setConfirmPhoneModal}
                newChatName={newChatName}
            
            />
       
        <form  
            className={cl.UserInfoView} 
            onSubmit={props.handleSubmit}
            >  

            <div className={cl.UserInfoViewLabel}>
                <span>Ваш Логин:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regLogin'}
                    type='text'
                    placeholder='Введите новый логин'
                    component={MyInput}
                    validationmessage='Только цифры или латиница'
                    validate={[requiredField, loginSybmolsValidate]}
                />
            </div>

            <div className={cl.UserInfoViewBtn}>

            </div>

            <div className={cl.UserInfoViewBeforeConfirm}>
                <span >OK</span>
            </div> 


            <div className={cl.UserInfoViewLabel}>
                <span>Ваш пароль:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regPassword'}
                    type='text'
                    placeholder='введите новый пароль'
                    component={MyInput}
                    validationmessage='должен содержать спец. симв, цифры и буквы'
                    validate={[requiredField, passwordSymbolsValidate]}
                />

            </div>

            <div className={cl.UserInfoViewBtn}>

            </div>

            <div className={cl.UserInfoViewBeforeConfirm}>
                <span >OK</span>
            </div> 

            <div className={cl.UserInfoViewLabel}>
                <span>Ваш email:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regEmail'}
                    type='email'
                    placeholder='введите новый емаил'
                    component={MyInput}
                    validationmessage='Введенная строка не емаил'
                    validate={[requiredField, emailSybmolsValidate]}
                />
            </div>

            <div className={cl.UserInfoViewBtn}>
            <MyButton
                onClick={regEmailButtonHandle}
                >
                    Подтвердить</MyButton>

                {/* TODO после сохранить тут высылаем емаил на кофирм. */}
            </div>

            <div className={cl.confirmMessage}>
                <span >Письмо выслано</span>
            </div> 

            <div className={cl.UserInfoViewLabel}>
                <span>Ваш телефон:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regPhone'}
                    type='text'
                    placeholder='Введите телефон'
                    component={MyInput}
                    validationmessage='Допускаются только цифры'
                    validate={[requiredField, phoneSybmolsValidate]}
                />

            </div>

            <div className={cl.UserInfoViewBtn}>
            <MyButton
                onClick={regPhoneButtonHandle}
                >
                    Подтвердить</MyButton>
            </div>
                {/* TODO после сохранить тут высылаем смс на кофирм. */}
            <div className={cl.confirmMessage}>
                <span >SMS выслано</span>
            </div> 

            <MyButton
                disabled={!isRegistrationButtonEnable}
            
            >
                Регистрация
            </MyButton>

        </form> 
    </>
    )
}

export default RegistrationForm
