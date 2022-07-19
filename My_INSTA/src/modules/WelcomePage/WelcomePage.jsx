import React, { useEffect, useMemo } from 'react';
import Footer from '../../components/pages/footer/Footer';
import Header from '../../components/pages/header/Header';
import cl from './WelcomePage.module.css'
import LoginForm from './LoginForm/LoginForm';
import { reduxForm } from 'redux-form';
import { connect } from  'react-redux';
import { setUnverifyedUser, setVerifyedUser, setThunkResteredUsersData } from '../../redux/ActionCreators';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { get, omit } from 'lodash'
import { getRegisteredUsersAPI } from '../../API/getRegisteredUsersAPI';
import { getUserDictAPI } from '../../API/getUserDictAPI';
import { getUserTokenAPI } from '../../API/getUserToken';
import { getCheckUserAPI } from '../../API/getCheckUserAPI';
 

const WelcomePage = (props) => {
    const [isError, setIsError] = useState(false)
    const navigateMain = useNavigate()


//TODO перевести на async await и не заниматься херней

//получаем словари проверяем на вход, что юзер уже залогинен
    useEffect(()=>
    {
        props.getUsersDict()
        setTimeout(()=>{
            
            if (localStorage.getItem('SLNToken')) {  //localStorage.getItem('SLNUserName') && 
                console.log("test here", localStorage.getItem('SLNUserName'))
                props.checkUser(
                    {"username":localStorage.getItem('SLNUserName'), "Authorization":localStorage.getItem('SLNToken')}
                )
            }
        }, 500)
    },[])

    const memoDict = useMemo(()=>{
        window.localStorage.setItem('usersDict', JSON.stringify(props.usersDict))
        console.log('memo render', props.usersDict)
    }, [props.usersDict])



    useEffect(()=>{
        if ((get(props.userCheckResult, ['0', 'status'])) === 200){
           navigateMain("main/")
        }
    },[props.userCheckResult])


    //работа с формой
    const LoginReduxForm = reduxForm({
        form: 'login'
    }) (LoginForm)

    
// в этом блоке мы во первых инфу из формы логин - запрашиваем токен на бек. Второе кладем имя юзера пока в стейт. 
// если вдруг будет ошибка то просто хрен всем. 
    const onSubmit = (formData) => {
        props.getUserToken(formData)
        props.setUnveryfyedUserStatus(omit(formData, 'password'))
    }

// короче тут получили ответ по токену и проверяем. тут именно логинизация. если код 200 то пишем в локал сторадж логин и пароль. и потом переходим на след страницу
    useEffect(()=>{
        if (get(props.userToken, [0, 'status']) == 200){
            localStorage.setItem('SLNUserName', props.isActualUser.username);
            localStorage.setItem('SLNToken', "Token " + get(props.userToken, [0, 'data', 'key']))
            navigateMain("main/")
        }
        if (get(props.userToken, [0, 'status']) == 400){
            setIsError(true)
         }
    },[props.userToken])

    function RegistrationProcess () {
        navigateMain('registration/')
    }

    return (
        <div>
            <Header/>

            <div className={cl.BaseLayer}>

                    <LoginReduxForm 
                        onSubmit={onSubmit} 
                        isError={isError}
                        RegistrationProcess = {RegistrationProcess}
                    />
                    <div className={cl.FooterDown}>
                        <Footer/>

                    </div>
                </div>
        </div>
    );
};


export default connect(
    //mapStateToProps
    state => ({
        isActualUser: state.isActualUser,
        getUsers2: state.asyncUsersRequest,  //кладем в пропс из редюсера результат
        usersDict: state.usersDict,
        userToken: state.UserToken,
        userCheckResult: state.verifyUser,

        }),

    dispatch => ({
        setUnveryfyedUserStatus: (value) =>{
            dispatch(setUnverifyedUser(value))
        },
        setVeryfyedUserStatus: (value) =>{
            dispatch(setVerifyedUser(value))
        },
        getUsersThunk: () => {    //это просто ф-ция которую для запроса будем дергать 
            dispatch(getRegisteredUsersAPI())   //а вот это функция которая у нас в THUNK достаем через диспатч
        },
        getUsersDict: () => {
            dispatch(getUserDictAPI())
        },
        getUserToken: (userData) => {
            dispatch(getUserTokenAPI(userData))
        },
        checkUser: (userData) => {
            dispatch(getCheckUserAPI(userData))
        }
    })

    //mapDispatchToProps
    
    
    )(WelcomePage);