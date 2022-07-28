import React from 'react'
import { useState, useEffect } from 'react'
import { reduxForm } from 'redux-form';
import { get, filter, pick } from 'lodash'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserDictAPI } from '../../../API/getUserDictAPI'
import { putToBaseAPI } from '../../../API/putToBaseAPI'
import { postToBaseMediaAPI } from '../../../API/postToBaseMediaAPI';
import { createNewUserAPI } from '../../../API/createNewUserAPI';
import { 
    getPutToBaseResult, 
    getPostToBaseMediaResult, 
    getCreateEmptyUserResult, 
    getPutNewUserDataResult,
    getUserAvatarResult
} from '../../../redux/Selectors/baseSelectors'

import { putNewUserDataAPI } from '../../../API/putNewUserDataAPI';
import Header from '../header/Header'
import RegistrationForm from './RegistrationForm/RegistrationForm';
import cl from './RegistrationPage.module.css'
import { getUserAvatarAPI } from '../../../API/getUserAvatarAPI';
import { store } from '../../../redux/reducers/index'
import UserAvatarContainer from './userAvatarContainer/UserAvatarContainer';
import { useSelector } from 'react-redux';


function RegistrationPage(props) {
    const [userForEdit, setUserForEdit] = useState({})
    const [editUser, setEditUser] = useState({})
    const [aaa, setAaa] = useState()
    const [newUserToken, setNewUserToken] = useState()
    const [confirmPhoneModal, setConfirmPhoneModal] = useState(false)
    const [smsCodeToConfirm, setSmsCodeToConfirm] = useState('')
    const [wrongSmsCode, setWrongSmsCode] = useState(false)
    
    const [user, setUser] = useState({
        userID: null,
        authorID: null,
        userName: '',
        userEmail: '',
        authorPhone: null,
        authorAvatar: null,
    }
)

    //============после создания нового будущего юзера. присваиваем юзеру в стейте: id USER и id Author

  

    useEffect(()=>{
        props.createUser()
    },[])


    useEffect(()=>{
        setUserForEdit(props.createEmpyUserResult)
        setUser({...user, ...{authorID: props.createEmpyUserResult.id}})
        setNewUserToken(props.createEmpyUserResult.token)
        props.getUsersDict()
    },[props.createEmpyUserResult])


    useEffect(()=>{
        try{
            setUser({...user, ...{userID: get(filter(props.usersDict, {'userID': userForEdit.id}),['0', 'author'])}})
        }catch (err) {
            console.log('err', err)
        }
    }, [props.usersDict])
    //==================================END

    // useEffect(()=>{
    //     console.log('userrr', user)

    //     // usage props.putToBase(message, url, id)

    // },[user])


    // ==============контролируем что в юзере==============


    // Логика - создаем пустого юзера . 
    //     POST http://${BACKED_ADDRESS}/auth/registration/ HTTP/1.1
    //     Content-Type: application/json
    

    // в эту созданную заявку начинаем дополнять


    
    function submitRegistrationData(formData){
//  тут делаем следующее:
        // 1. Загружаем через putTobase: login, Имя, емаил в putto base user
         
        // 2. меняем пароль на новый с технического 'qwe+12345'
        const payload = {
            'username':formData.regLogin,
            'email':  formData.regEmail,
        }
        const url = '/users'

        const payloadAuthor = {
            'phone':formData.regPhone,
        }

        props.putNewUserData(
            payload,
            url,
            user.userID,
            newUserToken,
            formData.regPassword,
            user.authorID,
            payloadAuthor
            )
    }

    const navigate = useNavigate()

    useEffect(()=>{

        if (props.putNewUserDataResult.status === 200){
            navigate("/login")
        }
        else {
            // window.alert('Пользователь с данным ником уже зарегистрирован')
        }
    },[props.putNewUserDataResult])
//===========все. юзер создан!




    const RegForm = reduxForm({
        form: 'RegistrationForm'
    }) (RegistrationForm)

    if (confirmPhoneModal){
        console.log('pokazivaem modalku')
    }

    console.log('store', store.getState())

    return (
        <>
            <Header/>


            <div className={cl.BaseLayer}>
                <div className={cl.InnerContainer}>
                    <div>
                        <h3>Приветстуем Вас на форме регистрации</h3>
                        <h5>для внесения Ваших данных введите знание и нажмите ок.</h5>

                        <RegForm
                            onSubmit={submitRegistrationData}
                            user={user}
                            confirmPhoneModal={confirmPhoneModal}
                            setConfirmPhoneModal={setConfirmPhoneModal}
                            newChatName={smsCodeToConfirm}
                            putToBase={props.putToBase}

                        />
                    </div>

                        <UserAvatarContainer
                            userForEdit={userForEdit}
                            user={user}
                        />
                </div>
            </div>
        </>
    )
}

export default connect(
    //mapStateToProps
    state => ({
        usersDict: state.usersDict,
        putToBaseResult: getPutToBaseResult(state),
        postToBaseMediaResult: getPostToBaseMediaResult(state),
        createEmpyUserResult: getCreateEmptyUserResult(state),
        putNewUserDataResult: getPutNewUserDataResult(state),
        getUserAvatarResult: getUserAvatarResult(state)
    }),

    //mapDispatchToProps
    dispatch => ({
        getUsersDict: () => {
          dispatch(getUserDictAPI())
        },
        putToBase: (value, url, id) => {
            dispatch(putToBaseAPI(value, url, id))
        },  
        postToBaseMedia: (formData, url) => {
            dispatch(postToBaseMediaAPI(formData, url))
        },  
        createUser: () => {
            dispatch(createNewUserAPI())
        }, 
        putNewUserData: (message, url, id, userToken, password, authorID, phoneData) => {
            dispatch(putNewUserDataAPI(message, url, id, userToken, password, authorID, phoneData))
        },
        getUserAvatar: (id) => {
            dispatch(getUserAvatarAPI(id))
        }, 
        
    })
)(RegistrationPage);


