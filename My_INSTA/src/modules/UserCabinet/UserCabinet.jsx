import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form';
import { get, filter } from 'lodash'
import { getUserDictAPI } from '../../API/getUserDictAPI'
import { filterQuery } from '../../services/filterQuery'
import { putToBaseAPI } from '../../API/putToBaseAPI'
import { postToBaseMediaAction } from '../../redux/actions/postToBaseMediaAction';
import { postToBaseMediaAPI } from '../../API/postToBaseMediaAPI';
import { changeUserPasswordAPI } from '../../API/changeUserPasswordAPI';
import { getPutToBaseResult, getPostToBaseMediaResult, getChangePasswordResult } from  '../../redux/Selectors/baseSelectors'
import Header from '../../components/pages/header/Header'
import Menu from '../Menu/Menu'
import MyButton from '../../UI/MyButton/MyButton'
import LKLogin from './LKLogin/LKLogin';
import LKEmail from './LKEmail/LKEmail';
import LKPassword from './LKPassword/LKPassword';
import cl from './UserCabinet.module.css'
import NameForm from '../../UI/LoadFIlesForm/NameForm';

import { getUserTokenAPI } from '../../API/getUserToken';
import LkAvatarContainer from './LkAvatarContainer/LkAvatarContainer';
import { BACKED_ADDRESS } from '../../constants/constants'




function _UserCabinet(
    {
        isForeignUserCabinet, 
        foreignUser,
        commentPrivateMessege,
        setForeignUserModal,
        ...props
    }
    ) {

//TODO валидацию на инпуты.
 
const [searchQuery, setSearchQuery] = useState('')
const [userLogin, setUserLogin] = useState('bb')
const [unconfirmedNewLogin, setUnconfirmedNewLogin] = useState('')
const [confirmLoginChanged, serConfirmLoginChanged] = useState(false)
const [confirmEmailChanged, serConfirmEmailChanged] = useState(false)
const [confirmPasswordChanged, serConfirmPasswordChanged] = useState(false)
const [avatarDitry, setAvatarDirty] = useState('')
const [avatarImage, setAvatarImage] = useState(get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'avatar']) )

const [userEmail, setUserEmail] = useState('aa')
const [isSocialAcc, setIsSocialAcc] = useState(false)
const [userPassword, setPassword] = useState('')
const [oldPassword, setOldPassword] = useState(false)
const [disableChangePassword, setDisableChangePassword] = useState()





// ---------если у нас пользак не авторизован - кдиаем его на страницу логина. 
const navigate = useNavigate()

// if (!localStorage.getItem('SLNUserName')){
//     navigate("/login")
// }

//console.log('LK render 3 times')


useEffect(()=>{
    props.getUsersDict()
  },[])

  
console.log('foreignUser2', foreignUser)

  useEffect(()=>{
    console.log('foreignUser3', foreignUser)
    if (!isForeignUserCabinet){

        if (props.usersDict.length){
            setUserLogin(get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'username']))
            setUserEmail(get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'email']))
            setIsSocialAcc(get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'socialAcc']))
    } }
},[props.usersDict])


useEffect(() => {
        if (foreignUser){
            setUserLogin(get(filter(props.usersDict, {'username':foreignUser}),[0, 'username']))
            setUserEmail(get(filter(props.usersDict, {'username':foreignUser}),[0, 'email']))

            console.log('foreignUser', foreignUser)
            console.log('login', get(filter(props.usersDict, {'username':foreignUser}),[0, 'username']))
            console.log('email', get(filter(props.usersDict, {'username':foreignUser}),[0, 'email']))
    }
}, [foreignUser])




const LKLoginForm = reduxForm({
    form: 'LKLogin'
}) (LKLogin)

const LKEmailForm = reduxForm({
    form: 'LKEmail'
}) (LKEmail)


const LKPasswordForm = reduxForm({
    form: 'LKPassword'

}) (LKPassword)

//меняем логин. после изменения на беке перезаписываем 
function onSubmitLogin(formData) {

    const message = {
        "username": formData.lklogin 
    }
    const url = '/users'
    props.putToBase(
        message,
        url,
        get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id'])
        )
        setUnconfirmedNewLogin(formData.lklogin)

}

useEffect(()=>{
    // TODO обрбаотать ошибку. при ошибке ставить false
    if (props.putToBaseResult === 200 && unconfirmedNewLogin) {
        serConfirmLoginChanged(true)
        localStorage.setItem('SLNUserName', unconfirmedNewLogin);
        setUnconfirmedNewLogin('')
        window.location.reload();
    }
    else {
        serConfirmLoginChanged(false)
        setUnconfirmedNewLogin('')

    }
},[props.putToBaseResult])


//==============================E M A I L   C H A N G E ===============
function onSubmitEmail(formData) {
    const message = {
        "email": formData.lkemail 
    }
    const url = '/users'
    props.putToBase(
        message,
        url,
        get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id'])

        )
        setUnconfirmedNewEmail(formData.lkemail)
}

useEffect(()=>{
    if (props.putToBaseResult === 200 && unconfirmedNewEmail) {
        serConfirmEmailChanged(true)
        setUnconfirmedNewEmail('')
    }
    else {
        serConfirmEmailChanged(false)
        setUnconfirmedNewEmail('')
    }
},[props.putToBaseResult])
//=================================END==========


function onSubmitPassword(formData) {
    //TODO в этом месте происходит запрос пароля на сервер. И оттуда приходит тру или фолс и мые его тут присваиваем
    props.changePassword(localStorage.getItem('SLNToken'), formData)
}

useEffect(()=>{
    if (props.changePasswordResult.message === 'Password updated successfully')
        serConfirmPasswordChanged(true)
},[props.changePasswordResult])


function handleAvatarChange(event){
    console.log('отправляем на Юг аватарку')
    
}

// Блок фильтрации роликов//////////////////////////////////////////
function checkTheInput(event){
    setSearchQuery(event.target.value)

}
const listFiles=[]
const filteredVideo=filterQuery(listFiles, searchQuery)

// ВСЕ
//TODO убрать тут из меню в этой странице поиск.





// обработка загрузки аватарки
function handleAvatarSubmit(e) {
    e.preventDefault();
    let files = e.target.files

    var formData = new FormData;
    formData.append('imagefile', files[0]);

        const url = `http://${BACKED_ADDRESS}/api/author/${get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'userID'])}/`

        props.postToBaseMedia(formData, url)
        //setAvatarDirty()
        console.log('1111', formData,files)
}

const [unconfirmedNewEmail, setUnconfirmedNewEmail] = useState('')
const [avaChanged, setAvaChanged] = useState('')


    useEffect(()=> {
        if (props.postToBaseMediaResult.status === 200){
           props.getUsersDict()
        }
    }, [props.postToBaseMediaResult])

    console.log('111', isForeignUserCabinet)

    const sendPrivateMessage = (e) => {
        setForeignUserModal(false)
        commentPrivateMessege(e,  foreignUser)
    }

    return (
        <>
            { !isForeignUserCabinet &&
            <div>

                <Header/>
                <Menu 
                    disable
                    value={searchQuery}
                    onChange={checkTheInput}
                    placeholder='Поиск в названиях'
                />
            </div>
            }



            <div className={ !isForeignUserCabinet ? cl.BaseLayer : cl.BaseLayerForeignUser}>
                <div className={cl.InnerContainer}>
                    <div>
                        {!isForeignUserCabinet &&
                        <div>
                            <h3>Приветстуем Вас {localStorage.getItem('SLNUserName')}</h3>
                            <h5>для изменения Ваших данных введите новое значение и нажмите изменить.</h5>
                        </div>
                        
                        }

                        <LKLoginForm 
                            onSubmit={onSubmitLogin} 
                            userLogin={userLogin}
                            initialValues={{username: 'test'}}
                            confirmLoginChanged={confirmLoginChanged}
                            disabled={isForeignUserCabinet}
                            //isError={isError}
                            />

                        <LKEmailForm 
                            onSubmit={onSubmitEmail} 
                            userEmail={userEmail}
                            confirmEmailChanged={confirmEmailChanged}
                            disabled={isForeignUserCabinet}
                            // isError={isError}
                        />

                        {!isSocialAcc && !isForeignUserCabinet
                            && <LKPasswordForm 
                                onSubmit={onSubmitPassword} 
                                oldPassword={oldPassword}
                                confirmPasswordChanged={confirmPasswordChanged}
                                
                            //  isError={isError}
                            />
                        }

                    {/* <LkAvatarContainer
                    avatarImage={get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'avatar'])}
                    /> */}

                    </div>


                    <div className={cl.UserInfoViewImage}>
                        {!isForeignUserCabinet ?
                            <div>
                                {get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'avatar']) 
                                    ? <span> <img src={get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'avatar'])}/></span>
                                    : <span><img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='avatar'/></span>
                                }
                            </div>
                        
                        :   <div>
                                {get(filter(props.usersDict, {'username':foreignUser}),[0, 'avatar']) 
                                    ? <span> <img src={get(filter(props.usersDict, {'username':foreignUser}),[0, 'avatar'])}/></span>
                                    : <span><img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='avatar'/></span>
                                }
                    </div>

                        }

                            
                            {!isForeignUserCabinet &&
                                <div className={cl.AvatarButton}>
                                    Для смены аватара выберите другое изображение
                                    <p></p>
                                    <NameForm 
                                        handleSubmit={handleAvatarSubmit}  
                                        />                           
                                </div>
                            }


                    </div>

                    {isForeignUserCabinet &&
                    <div>

                        <div>
                        </div>

                        <MyButton
                            onClick={e => sendPrivateMessage(e)}
                        //    onClick={e => commentPrivateMessege(e,  foreignUser)}
                            >
                        Написать личное сообщение</MyButton>

                    </div>
                        
                    }

                </div>                

            </div>


        
        </>
        
        
    )
}

//
// const mapStateToProps = (state, props) => ({
//     initialValues: state.initialName, // retrieve name from redux store 
//   })
  
const UserCabinet = React.memo(_UserCabinet)

export default connect(
    //mapStateToProps
    state => ({
        usersDict: state.usersDict,
        putToBaseResult: getPutToBaseResult(state),
        postToBaseMediaResult: getPostToBaseMediaResult(state),
        changePasswordResult: getChangePasswordResult(state),
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
        changePassword: (userToken, formData) => {
            dispatch(changeUserPasswordAPI(userToken, formData))
        },   
    })
)(UserCabinet);


