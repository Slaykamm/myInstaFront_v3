import React from 'react'
import { get } from 'lodash'
import cl from './userVideoLoadingForm.module.css'
import NameForm from '../../../../UI/LoadFIlesForm/NameForm'
import MyButton from '../../../../UI/MyButton/MyButton'
import { BACKED_ADDRESS } from  '../../../../constants/constants'

function UserVideoLoadingForm({
    handleAvatarSubmit,
    queryVideoInput,
    setQueryVideoInput,
    queryDescriptionInput,
    setQueryDescriptionInput,
    submitVideo,
    handlePreviewSubmit,
    submitVideoLoadingForm,
    disabled,
    submitAddNewVideoForm,
    videoObject,
    isImageLoaded,
    isVideoLoaded,
    isEditVideo,
    videoPreview,
    handleEditVideo,
    videoId,
    ...props}) {

        console.log('isEditVideo', isEditVideo)
        function submitVideoLoadingForm(e){
            submitAddNewVideoForm()
        }

        function editVideoLoadingForm(e){
            handleEditVideo(videoId, queryVideoInput, queryDescriptionInput)

        }


    return (
        <>
            <div className={cl.videoLoadingInterface}>
                <h3 className={cl.VideoInfo}>Интерфейс загрузки видеороликов:</h3>
                <div className={cl.VideoLoadingLayer}>
                    <div>Наименование Ролика:</div>
                    <div>Описание Ролика</div>
                    <div>
                        <textarea className={cl.InputArea}
                            value={queryVideoInput}
                            onChange={e=>setQueryVideoInput(e.target.value)}            
                    /></div>

                    <div>
                        <textarea className={cl.InputArea}
                            value={queryDescriptionInput}
                            onChange={e=>setQueryDescriptionInput(e.target.value)}
                        /></div>
                        <div className={cl.InnerContainer} >
                            {/* <span><img src='http://${BACKED_ADDRESS}/media/avatar/default.jpg' alt='avatar'/></span> */}

                        {isVideoLoaded     //get(videoObject,['video']) 
                                ? <span><img src={`http://${BACKED_ADDRESS}/media/avatar/VideoLoaded.jpg`} alt='video'/></span>
                                : <span><img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='video'/></span>
                            }

                        </div>


                        <div className={cl.InnerContainer}>
                        {isImageLoaded             //get(videoObject,['image']) 
                                ? isEditVideo 
                                    ? <span> <img src={videoPreview} alt='video'/></span>
                                    : <span> <img src={`http://${BACKED_ADDRESS}/media/avatar/VideoLoaded.jpg`} alt='video'/></span>
                                : <span><img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='preview'/></span>
                            }
                        </div>
                    


                        {!isEditVideo &&
                            <>
                                <div className={cl.InnerContainer}>
                                    <NameForm
                                    handleSubmit={submitVideo}
                                    />
                                </div>

                                <div className={cl.InnerContainer}>
                                    <NameForm
                                    handleSubmit={handlePreviewSubmit}
                                    />
                                    
                                </div>

                                    {!isVideoLoaded
                                    ? <div className={cl.InnerContainer}><span>Загрузка Видео</span></div>
                                    : <div className={cl.InnerContainer}><span>Видео загружено</span></div>
                                    }
                
                                    {!isImageLoaded  
                                    ? <div className={cl.InnerContainer}><span>Загрузка Превью</span></div>
                                    : <div className={cl.InnerContainer}><span>Превью загружено</span></div>
                                    }
                            </>
                        }


                </div>
            </div>
                {!isEditVideo 
                
                ? <MyButton
                    onClick={e=>submitVideoLoadingForm(e)}
                    disabled={!disabled}
                >Загрузить видео</MyButton>   
                
                : <MyButton
                    onClick={e=>editVideoLoadingForm(e)}
                    >
                    Изменить видео
                    </MyButton>
            
            }       
                    

        </>

    )
}

export default UserVideoLoadingForm
