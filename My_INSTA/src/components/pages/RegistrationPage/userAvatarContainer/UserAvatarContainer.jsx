import React from 'react'
import NameForm from '../../../../UI/LoadFIlesForm/NameForm'
import cl from './UserAvatarContainer.module.css'
import { useState } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import { BACKED_ADDRESS } from '../../../../constants/constants'


export default function UserAvatarContainer(
    {
        //handleSubmit,
        userForEdit,
        user,
        ...props
    }
) {

    const [userAvatar, setUserAvatar] = useState()

    function handleAvatarSubmit(e) {
        e.preventDefault();
        if (userForEdit?.id){
            let files = e.target.files
            var formData = new FormData;
            formData.append('imagefile', files[0]);
            const url = `http://${BACKED_ADDRESS}/api/author/${userForEdit.id}/`


            // props.postToBaseMedia(formData, url)

            const postMedia = fetch(url, {
                method: "POST", 
                    body: formData,//JSON.stringify(data4), // data4,// // string, FormData, Blob, BufferSource или URLSearchParams
                    referrer: "", // или "" для того, чтобы не послать заголовок Referer,
                    // или URL с текущего источника
                    referrerPolicy: "no-referrer", // no-referrer, origin, same-origin...
                    mode: "cors", // same-origin, no-cors
                    credentials: "same-origin", // omit, include
                    cache: "default", // no-store, reload, no-cache, force-cache или only-if-cached
                    redirect: "follow", // manual, error
                //  integrity: "", // контрольная сумма, например "sha256-abcdef1234567890"
                    keepalive: false, // true
                    signal: undefined, // AbortController, чтобы прервать запрос
                    window: window // null
            })
            postMedia.then(resp => {
                if (resp.status === 200){
                    console.log('loaded')
                    const getAvatar = axios.get(`http://${BACKED_ADDRESS}/api/author/?id=${user.authorID}`);
                    getAvatar.then(response => {
                        console.log('response AVA', response)
                        setUserAvatar(get(response.data, ['0', 'avatar']))
                    })

                }
            })
            }
        }


  return (
    <div className={cl.UserInfoViewImage}>
        {userAvatar
            ? <span><img src={userAvatar} alt='avatar'/></span>
            : <span><img src={`http://${BACKED_ADDRESS}/media/avatar/default.jpg`} alt='avatar'/></span>
        }

        <div className={cl.AvatarButton}>
            <p></p>
            <NameForm 
                handleSubmit={handleAvatarSubmit}  
                />                           
        </div>
    </div>
  )
}
