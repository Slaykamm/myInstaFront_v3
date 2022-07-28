import React from 'react';
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getUserDictAPI } from '../../API/getUserDictAPI'
import { setLeftSideBarHideAction } from '../../redux/ActionCreators';
import Offcanvas from 'react-bootstrap/Offcanvas'
import cl from './LeftSideBar.module.css'
import { filter, get } from 'lodash'
import Nav from 'react-bootstrap/Nav'
import { BACKED_ADDRESS } from '../../constants/constants';


const _LeftSideBar = (props) => {

  const [userInfo, setUserInfo] = useState()
  function handleClose () {
      props.setLeftPanelRedux(false);
  }

    //console.log('leftSideBar 3 renders')
    useEffect(()=>{
      props.getUsersDict()
    },[])

    //TODO исправить это. сделать чтобы то что ниже клало ай ди юзера
    useEffect(()=>{
      console.log('props.', props.usersDict)
      setUserInfo(props.usersDict[0])
    },[props.usersDict])


    const test = filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')})

    

  return (
    <>
      {console.log('userInfo', userInfo)}
      {userInfo
      ? 
        <Offcanvas show={props.sideBarShow} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Личный кабинет</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ul className={cl.userInfo}>
            <li >

                {get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'avatar']) 
                            ? <span> <img src={get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'avatar'])}/></span>
                            : <span><img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='avatar'/></span>
                        }


              </li>
              <li>
                <p>{get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'username'])}</p>
              </li>
              

                <li className={cl.textHover}>
                <Nav.Item>
                    <Nav.Link href="/lk"><span style={{color:'black'}}>Страница Вашего Профиля</span></Nav.Link>
                </Nav.Item>
                </li >

                <li className={cl.textHover}>
                    <Nav.Link href="/userVideoPage"><span style={{color:'black'}}>Ваши видео</span></Nav.Link>
                </li >

                <li className={cl.textHover}>
                    <Nav.Link href="/userVideoArchive"><span style={{color:'black'}}>Ваши видео в архиве</span></Nav.Link>
                </li >

                <li className={cl.textHover} >
                    <Nav.Link href="/privateMessages"><span style={{color:'black'}}>Ваши личные сообщения</span></Nav.Link>
                    
                </li >
                <li className={cl.textHover}>
                <Nav.Item>
                    <Nav.Link href="/userclean"><span style={{color:'black'}}>Выход</span></Nav.Link>
                </Nav.Item>
                </li>

            </ul>
          </Offcanvas.Body>
        </Offcanvas>    
      : <p>Ожидаем данные с сервера</p>
    
    
      }


    </>
  );
}
  const LeftSideBar = React.memo(_LeftSideBar)
  export default connect(
    //mapStateToProps
    state => ({
        sideBarShow: state.sideBarShow,
        usersDict: state.usersDict
    }),

    //mapDispatchToProps
    dispatch => ({
        setLeftPanelRedux: (value) =>{
            dispatch(setLeftSideBarHideAction(value))
        },
        getUsersDict: () => {
          dispatch(getUserDictAPI())
        }
    })
)(LeftSideBar);