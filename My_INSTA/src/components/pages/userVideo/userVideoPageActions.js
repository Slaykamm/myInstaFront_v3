import { get, filter } from 'lodash' 
import { BACKED_ADDRESS } from '../../../constants/constants';


export function createNewVideoAction( queryVideoInput, queryDescriptionInput, usersDict,  propsCreateNewVideo){
    const payload = {
        "title": queryVideoInput + Date.now(),
        "description": queryDescriptionInput + Date.now(),
        "create_at": Date.now(),
        "rating": 0,
        "author": get(filter(usersDict, {'username': localStorage.getItem('SLNUserName')}),[0,'id'])
    }
    propsCreateNewVideo(payload)
}




/**
* Закидывает видео из формы на Бэк
* @param { files, files, id, postToBaseMedia } name    Name of the user
*/

export function submitVideoAction(files, id, postToBaseMedia){

    var formData = new FormData;
    formData.append('videofile', files[0]);
        const url = `http://${BACKED_ADDRESS}/api/video/${id}/`
        postToBaseMedia(formData, url)
        
}

/**
* Закидывает титульную картинку из формы на Бэк
* @param { files, files, id, postToBaseMedia } 
*/

export function handlePreviewSubmitAction(files, id, postToBaseMedia) {
    var formData = new FormData;
    formData.append('imagefile', files[0]);
        const url = `http://${BACKED_ADDRESS}/api/video/${id}/`
        postToBaseMedia(formData, url)
}



export function submitAddNewVideoFormAction(queryVideoInput, queryDescriptionInput, id, putToBase){

    const payload = {
        "title": queryVideoInput,
        "description": queryDescriptionInput,
    }
    const url = `/video`
    putToBase(payload, url, id)
}