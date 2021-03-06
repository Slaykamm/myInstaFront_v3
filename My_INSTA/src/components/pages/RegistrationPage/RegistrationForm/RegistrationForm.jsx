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

        axios.get(`http://127.0.0.1:8000/api/auth/emailverify/?id=${user.userID}&author=${user.authorID}&email=${userEmail}`)
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
        axios.post('http://127.0.0.1:8000/send_otp/', body)
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
                <span>?????? ??????????:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regLogin'}
                    type='text'
                    placeholder='?????????????? ?????????? ??????????'
                    component={MyInput}
                    validationmessage='???????????? ?????????? ?????? ????????????????'
                    validate={[requiredField, loginSybmolsValidate]}
                />
            </div>

            <div className={cl.UserInfoViewBtn}>

            </div>

            <div className={cl.UserInfoViewBeforeConfirm}>
                <span >OK</span>
            </div> 


            <div className={cl.UserInfoViewLabel}>
                <span>?????? ????????????:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regPassword'}
                    type='text'
                    placeholder='?????????????? ?????????? ????????????'
                    component={MyInput}
                    validationmessage='???????????? ?????????????????? ????????. ????????, ?????????? ?? ??????????'
                    validate={[requiredField, passwordSymbolsValidate]}
                />

            </div>

            <div className={cl.UserInfoViewBtn}>

            </div>

            <div className={cl.UserInfoViewBeforeConfirm}>
                <span >OK</span>
            </div> 

            <div className={cl.UserInfoViewLabel}>
                <span>?????? email:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regEmail'}
                    type='email'
                    placeholder='?????????????? ?????????? ??????????'
                    component={MyInput}
                    validationmessage='?????????????????? ???????????? ???? ??????????'
                    validate={[requiredField, emailSybmolsValidate]}
                />
            </div>

            <div className={cl.UserInfoViewBtn}>
            <MyButton
                onClick={regEmailButtonHandle}
                >
                    ??????????????????????</MyButton>

                {/* TODO ?????????? ?????????????????? ?????? ???????????????? ?????????? ???? ????????????. */}
            </div>

            <div className={cl.confirmMessage}>
                <span >???????????? ??????????????</span>
            </div> 

            <div className={cl.UserInfoViewLabel}>
                <span>?????? ??????????????:</span>
            </div>

            <div className={cl.UserInfoViewInput}>
                <Field
                    name={'regPhone'}
                    type='text'
                    placeholder='?????????????? ??????????????'
                    component={MyInput}
                    validationmessage='?????????????????????? ???????????? ??????????'
                    validate={[requiredField, phoneSybmolsValidate]}
                />

            </div>

            <div className={cl.UserInfoViewBtn}>
            <MyButton
                onClick={regPhoneButtonHandle}
                >
                    ??????????????????????</MyButton>
            </div>
                {/* TODO ?????????? ?????????????????? ?????? ???????????????? ?????? ???? ????????????. */}
            <div className={cl.confirmMessage}>
                <span >SMS ??????????????</span>
            </div> 

            <MyButton
                disabled={!isRegistrationButtonEnable}
            
            >
                ??????????????????????
            </MyButton>

        </form> 
    </>
    )
}

export default RegistrationForm
