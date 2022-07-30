import React from 'react';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Menu from '../../../modules/Menu/Menu';
import MenuNew from '../../../modules/MenuNew/MenuNew';
import { connect } from  'react-redux';
import { getVideoPreviewsAPI } from '../../../API/getPreviewAPI'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState} from 'react';
import { useEffect } from 'react';
import { filterQuery } from '../../../services/filterQuery';
import VideoContainer from './VideoContainer/VideoContainer';
import { map, reverse, sortBy } from 'lodash';
import cl from './MainPage.module.css'
import { NavLink } from 'react-router-dom';
import UserStream from './UserStream/UserStream';



const _MainPage = (props) => {

const [listFiles, setListFiles] = useState()




//TODO какгохо хрена надо 2 раза дергать
useEffect(()=>{
    props.getPreviewAPI()

},[])


// вывод ленты свежих видео для юзера
useEffect(()=>{
    setListFiles(props.videoPreviews.filter(({archived, title}) => 
        (archived !== true && title.slice(0, 4) !== '1656')
    ))
},[props.videoPreviews])


const lastVideosForUser = reverse(sortBy(listFiles, ['create_at']))
console.log('lastvideosforUser', lastVideosForUser)
//const filterArchived = sortedStream.filter(({archived}) => archived !== true)


// Блок фильтрации роликов//////////////////////////////////////////
const [searchQuery, setSearchQuery] = useState('')
function checkTheInput(event){
    setSearchQuery(event.target.value)
}

const filteredVideo=filterQuery(listFiles, searchQuery)




// ВСЕ

 
    return (
            <div>
                <Header/>
                <MenuNew
                    value={searchQuery}
                    onChange={checkTheInput}
                    placeholder='Поиск в названиях и описаниях'
                />

                <UserStream
                    lastVideosForUser={lastVideosForUser}
                />
             
                <VideoContainer
                    listFiles={listFiles}
                    filteredVideo={filteredVideo}
                    lastVideosForUser={lastVideosForUser}
                />
                <Footer/>
            </div>
    );
};

const MainPage = React.memo(_MainPage)

export default connect(
    // mapStateToProps
    state => ({
        videoPreviews: state.getPreview

    }),

    //mapDispatchToProps
    dispatch => ({
        getPreviewAPI: () =>{
            dispatch(getVideoPreviewsAPI())
        },
        
    })

)(MainPage); 



