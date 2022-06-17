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
import NameForm from '../../../UI/LoadFIlesForm/NameForm';

import cl from './RegistrationPage.module.css'
import { getUserAvatarAPI } from '../../../API/getUserAvatarAPI';


function RegistrationPage(props) {
    const [userForEdit, setUserForEdit] = useState({})
    const [editUser, setEditUser] = useState({})
    const [aaa, setAaa] = useState()
    const [newUserToken, setNewUserToken] = useState()
    
    const [user, setUser] = useState({
        userID: null,
        authorID: null,
        userName: '',
        userEmail: '',
        authorPhone: null,
        authorAvatar: null,
    }
)
    const [userAvatar, setUserAvatar] = useState()

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
    //     POST http://127.0.0.1:8000/auth/registration/ HTTP/1.1
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
    },[props.putNewUserDataResult])
//===========все. юзер создан!


    const RegForm = reduxForm({
        form: 'RegistrationForm'
    }) (RegistrationForm)


    // обработка загрузки аватарки========================+
    function handleAvatarSubmit(e) {
        e.preventDefault();
        if (userForEdit.id){
            let files = e.target.files
            var formData = new FormData;
            formData.append('imagefile', files[0]);
            const url = `http://127.0.0.1:8000/api/author/${userForEdit.id}/`

            props.postToBaseMedia(formData, url)
            }
        }

    useEffect(()=> {
        if (props.postToBaseMediaResult.status === 200){
                props.getUserAvatar(user.authorID)
        }
    }, [props.postToBaseMediaResult])

    useEffect(()=>{
        if (props.getUserAvatarResult.status === 200){
            setUserAvatar(props.getUserAvatarResult.avatar)
        }
    }, [props.getUserAvatarResult])

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
                            />
                        </div>

                        {console.log('URL2', get(filter(props.usersDict, {'userID': userForEdit.id}),['0', 'avatar']))}

                        <div className={cl.UserInfoViewImage}>
                            {userAvatar
                                ? <span><img src={userAvatar} alt='avatar'/></span>
                                : <span><img src='http://127.0.0.1:8000/media/avatar/default.jpg' alt='avatar'/></span>
                            }

                            <div className={cl.AvatarButton}>
                                <p></p>
                                <NameForm 
                                    handleSubmit={handleAvatarSubmit}  
                                    />                           
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


