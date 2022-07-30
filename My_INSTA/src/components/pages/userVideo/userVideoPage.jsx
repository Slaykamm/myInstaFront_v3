import React from 'react'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { get, filter, includes } from 'lodash'
import Menu from '../../../modules/Menu/Menu'
import MenuNew from '../../../modules/MenuNew/MenuNew';
import Header from '../header/Header'
import VideoContainer from '../main/VideoContainer/VideoContainer'
import UserVideoLoadingForm from './userVideoLoadingForm/userVideoLoadingForm'
import MyModal from '../../../UI/MyModal/MyModal'
import UserVideoControlButtonForm from './userVideoControlButtonForm/userVideoControlButtonForm'
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
import { 
    createNewVideoAction, 
    submitVideoAction, 
    handlePreviewSubmitAction,
    submitAddNewVideoFormAction,
} from './userVideoPageActions'

import { videoValidator, imageValidator } from '../../../Validators/validators.ts'

import cl from './userVideoPage.module.css'

function _UserVideoPage(props) {

    //console.log('_UserVideoPage render 4 times')

    const [userVideoList, setUserVideoList] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [userID, setUserID] = useState('')
    const [loadingVideoActive, setLoadingVideoActive] = useState(false)
    const [deleteMode, setDeleteMode] = useState(false)
    const [archiveMode, setArchiveMode] = useState(false)

    const [listFilesVideosToDelete, setListFilesVideosToDelete] = useState([])
    const [listFilesVideosToArchive, setListFilesVideosToArchive] = useState([])
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [queryVideoInput, setQueryVideoInput] = useState('')
    const [queryDescriptionInput, setQueryDescriptionInput] = useState('')
    
    // оптимизирую словари
    // получаем словарь
    // useEffect(()=>{
    //     if (!props.usersDict.length){
    //        props.getUsersDict() 
    //     }
    // },[])

    // useEffect(()=>{
    //     setUserID(get(filter(props.usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id']))
    // }, [props.usersDict])
    // useEffect(()=>{
    //     props.getUserOwnerPreview(userID)
    // }, [userID])
    
    const usersDict = JSON.parse(window.localStorage.getItem('usersDict')) 
    const userId = get(filter(usersDict, {'username':localStorage.getItem('SLNUserName')}),[0, 'id'])


    
    useEffect(()=>{
        props.getUserOwnerPreview(userId)
    }, [userId])
    
    useEffect(()=>{
        setUserVideoList(props.videoUserOwnerPreviews?.filter(({archived}) => archived !== true))
    },[props.videoUserOwnerPreviews])
    
    // Блок фильтрации роликов//////////////////////////////////////////
    function checkTheInput(event){
        setSearchQuery(event.target.value)
    }
    const filteredVideo=filterQuery(userVideoList, searchQuery)


    // Кнопка активации модалки.
    function modalActivation(e) {
        e.preventDefault()
        setDeleteMode(false)
        setArchiveMode(false)
        setLoadingVideoActive(true)
        createNewVideoAction(queryVideoInput, queryDescriptionInput, usersDict, props.createNewVideo)
    }

// ========================видео сабмит
        function submitVideo(e){
            e.preventDefault();
            let files = e.target.files
            if (includes(videoValidator, files[0].type)){
                submitVideoAction(files, props.newVideoResult.id, props.postToBaseMedia)
                setIsVideoLoaded(true)
            }
            else{
                window.alert('Данным тип файла не поддерживается!')
            }


        }
            
        // обработка загрузки превью ------------------------------------------------
        function handlePreviewSubmit(e) {
            e.preventDefault();
            let files = e.target.files
            if (includes(imageValidator, files[0].type)){
                handlePreviewSubmitAction(files, props.newVideoResult.id, props.postToBaseMedia)
                setIsImageLoaded(true)
            }
            else{
                window.alert('Данным тип файла не поддерживается!')
            }
        }

        // кнопка отправки видео в форме
        function submitAddNewVideoForm(){
            submitAddNewVideoFormAction(queryVideoInput, queryDescriptionInput, props.newVideoResult.id, props.putToBase)
            setIsVideoLoaded(false)
            setIsImageLoaded(false)
            }

        // action если загрузили все то форму гасим.
        useEffect(()=> {
            if (props.putToBaseResult == 200){
                setQueryVideoInput('')
                setQueryDescriptionInput('')
                setLoadingVideoActive(false)
                window.location.reload()
            }
        },[props.putToBaseResult])

        
        // -------------------Обработка добавления к списку удаления и удаления оттуда
        function addToSetListFilesVideosToDelete(id){
            if (deleteMode) {
                setListFilesVideosToDelete([...listFilesVideosToDelete,  {'id': id}])
                console.log('deletel', [...listFilesVideosToDelete,  {'id': id}])
            }

            if (archiveMode) {
                setListFilesVideosToArchive([...listFilesVideosToArchive,  {'id': id}])
                console.log('id', id)
                console.log('archival', [...listFilesVideosToArchive,  {'id': id}])
            }
        }
        
        function deleteFromSetListFilesVideosToDelete(id){
            if (deleteMode) {
                setListFilesVideosToDelete(listFilesVideosToDelete.filter(file => file.id !== id))
            }
            if (archiveMode) {
                setListFilesVideosToArchive(listFilesVideosToArchive.filter(file => file.id !== id)) 
            }

        }

        // реагируем на подрузку видео
        useEffect(()=>{
           // console.log('gotovo', props.postToBaseMediaResult.length)
            if (props.newVideoResult.status === 201){
                props.getVideoFile(props.newVideoResult.id)
            }
            console.log('1111111111111', props.newVideoResult)
        },[props.newVideoResult])


        console.log('NEW VIDEO videoObject', props.videoObject)
    return (
        <>
            <Header/>
            <MenuNew
                value={searchQuery}
                onChange={checkTheInput}
                placeholder='Поиск в названиях'
            />

            <UserVideoControlButtonForm
                setDeleteMode={setDeleteMode}
                userVideoList={userVideoList}
                setUserVideoList={setUserVideoList}
                listFilesVideosToDelete={listFilesVideosToDelete}
                setListFilesVideosToDelete={setListFilesVideosToDelete}
                listFilesVideosToArchive={listFilesVideosToArchive}               
                setListFilesVideosToArchive={setListFilesVideosToArchive}
                deleteFromBase={props.deleteFromBase}
                putToBase={props.putToBase}
                modalActivation={modalActivation}
                setArchiveMode={setArchiveMode}
            />

            <div className={cl.PaddingForVideoAtUsersPage}>
                {filteredVideo.length 
                ? <div >
                    <VideoContainer
                        listFiles={userVideoList}
                        filteredVideo={filteredVideo}
                        deleteMode={deleteMode}
                        archiveMode={archiveMode}
                        addToSetListFilesVideosToDelete={addToSetListFilesVideosToDelete}
                        deleteFromSetListFilesVideosToDelete={deleteFromSetListFilesVideosToDelete}
                        
                    />    
                </div>
                : <div>
                    <h3 className={cl.VideoInfo}> К сожалению, пока нет Ваших видео</h3>
                </div>
                }
            </div> 

            <MyModal
                visible={loadingVideoActive}
                setVisible={setLoadingVideoActive}
                >
                <UserVideoLoadingForm
                    queryVideoInput={queryVideoInput}
                    setQueryVideoInput={setQueryVideoInput}
                    queryDescriptionInput={queryDescriptionInput}
                    setQueryDescriptionInput={setQueryDescriptionInput}
                    submitVideo={submitVideo}
                    handlePreviewSubmit={handlePreviewSubmit}
                    disabled={isVideoLoaded && isImageLoaded && !!queryVideoInput && !!queryDescriptionInput }
                    isVideoLoaded={isVideoLoaded}
                    isImageLoaded={isImageLoaded}
                    submitAddNewVideoForm={submitAddNewVideoForm}
                    videoObject={props.videoObject}
                    isEditVideo={false}
                />
            </MyModal>
        </>
    )
}

const UserVideoPage = React.memo(_UserVideoPage)

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
)(UserVideoPage); 