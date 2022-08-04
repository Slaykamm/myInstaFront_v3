import 'bootstrap/dist/css/bootstrap.min.css';
// import { map, reverse, sortBy } from 'lodash';
var _ = require('lodash')
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getVideoPreviewsAPI } from '../../../API/getPreviewAPI';
import Menu from '../../../modules/Menu/Menu';
import MenuNew from '../../../modules/MenuNew/MenuNew';
import { getPreviewSelector } from '../../../redux/Selectors/baseSelectors';
import { filterQuery } from '../../../services/filterQuery';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import cl from './MainPage.module.css';
import UserStream from './UserStream/UserStream';
import VideoContainer from './VideoContainer/VideoContainer';
import { GetPreviewStateArray } from '../../../redux/reducers/getPreview';

const _MainPage: React.FC = (props) => {

const [listFiles, setListFiles] = useState()




//TODO какгохо хрена надо 2 раза дергать
useEffect(()=>{
    props.getPreviewAPI()

},[])



// вывод ленты свежих видео для юзера
useEffect(()=>{
    console.log('video', props.videoPreviews)
    setListFiles(props.videoPreviews.filter(({archived, title}) => 
        (archived !== true && title.slice(0, 4) !== '1656')
    ))
},[props.videoPreviews])


const lastVideosForUser = _.reverse(_.sortBy(listFiles, ['create_at']))
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
        videoPreviews: getPreviewSelector(state)

    }),

    //mapDispatchToProps
    dispatch => ({
        getPreviewAPI: () =>{
            dispatch(getVideoPreviewsAPI())
        },
        
    })

)(MainPage); 



