import React from 'react'
import Menu from '../../../modules/Menu/Menu'
import MenuNew from '../../../modules/MenuNew/MenuNew';
import Header from '../header/Header'
import cl from './userVideoArchive.module.css'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { get, filter, includes } from 'lodash'
import { filterQuery } from '../../../services/filterQuery'
import { getUserDictAPI } from '../../../API/getUserDictAPI'
import { createNewVideoAPI } from '../../../API/createNewVideoAPI'
import { deleteFromBaseAPI } from '../../../API/deleteFromBaseAPI'
import { postToBaseMediaAPI} from '../../../API/postToBaseMediaAPI'
import { getVideoUserOwnerAPI } from '../../../API/getVideoUserOwnerAPI'
import { getVideoAPI } from '../../../API/getVideoAPI'
import { putToBaseAPI } from '../../../API/putToBaseAPI'
import { 
    getNewVideoResult, 
    getDeleteFromBaseResult, 
    getPostToBaseMediaResult, 
    getPutToBaseResult 
} from '../../../redux/Selectors/baseSelectors'
import VideoContainer from '../main/VideoContainer/VideoContainer'
import UserVideoControlButtonForm from './userVideoControlButtonForm/userVideoControlButtonForm'

function _UserVideoArchive(props) {

  const [userVideoList, setUserVideoList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [archiveMode, setArchiveMode] = useState(false)

  const [listFilesVideosToArchive, setListFilesVideosToArchive] = useState([])


  const usersDict = JSON.parse(window.localStorage.getItem('usersDict')) 
  const userId = get(filter(usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id'])


    useEffect(()=>{
        props.getUserOwnerPreview(userId)
    }, [userId])
    
    // TODO добавить фильтрацию по автору
    useEffect(()=>{
        setUserVideoList(props.videoUserOwnerPreviews?.filter(({archived}) => archived === true))
        console.log('aaa', props.videoUserOwnerPreviews?.filter(({archived}) => archived === true))
    },[props.videoUserOwnerPreviews])
    
    // Блок фильтрации роликов//////////////////////////////////////////
    function checkTheInput(event){
      setSearchQuery(event.target.value)
  }
  const filteredVideo=filterQuery(userVideoList, searchQuery)




  function addToSetListFilesVideosToDelete(id){
    if (archiveMode) {
        setListFilesVideosToArchive([...listFilesVideosToArchive,  {'id': id}])
    }
}

  function deleteFromSetListFilesVideosToDelete(id){
      if (archiveMode) {
          setListFilesVideosToArchive(listFilesVideosToArchive.filter(file => file.id !== id)) 
      }

  }

  useEffect(() => {
    if (props.putToBaseResult == 200){
      setArchiveMode(false)
      window.location.reload()
  }
  })




  return (
    <>
    
      <Header/>
      <MenuNew
        value={searchQuery}
        onChange={checkTheInput}
        placeholder='Поиск в названиях'
      />    

<UserVideoControlButtonForm
                userVideoList={userVideoList}
                listFilesVideosToArchive={listFilesVideosToArchive}               
                setListFilesVideosToArchive={setListFilesVideosToArchive}
                putToBase={props.putToBase}
                setArchiveMode={setArchiveMode}

            />



<div className={cl.PaddingForVideoAtUsersPage}>
                {filteredVideo.length 
                ? <div >
                    <VideoContainer
                        listFiles={userVideoList}
                        filteredVideo={filteredVideo}
                        archiveMode={archiveMode}
                        addToSetListFilesVideosToDelete={addToSetListFilesVideosToDelete}
                        deleteFromSetListFilesVideosToDelete={deleteFromSetListFilesVideosToDelete}
                        
                    />    
                </div>
                : <div>
                    <h3 className={cl.VideoInfo}> К сожалению, пока нет Ваших видео в архиве</h3>
                </div>
                }
            </div> 

    </>
  )
}

const UserVideoArchive = React.memo(_UserVideoArchive)

export default connect(
    state => ({
        videoUserOwnerPreviews: state.videoOwnerUser,
        usersDict: state.usersDict,
        newVideoResult: getNewVideoResult(state),
        deleteToBaseResult: getDeleteFromBaseResult(state),
        postToBaseMediaResult: getPostToBaseMediaResult(state),
        putToBaseResult: getPutToBaseResult(state),
        videoObject: state.getVideo,

    }),

    dispatch => ({
        getUserOwnerPreview: (value) =>{
            dispatch(getVideoUserOwnerAPI(value))
        },
        getUsersDict: () => {
            dispatch(getUserDictAPI())
        },
        createNewVideo: (payload) => {
            dispatch(createNewVideoAPI(payload))
        },
        deleteFromBase: (id, url) => {
            dispatch(deleteFromBaseAPI(id, url))
        },
        postToBaseMedia: (formData, url) => {
            dispatch(postToBaseMediaAPI(formData, url))
        }, 
        putToBase: (value, url, id) => {
            dispatch(putToBaseAPI(value, url, id))
        },
        getVideoFile: (id) => {
            dispatch(getVideoAPI(id))
        },
    })
)(UserVideoArchive); 