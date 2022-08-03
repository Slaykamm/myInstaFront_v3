import React from 'react'
import { Routes, Route, Navigate,  } from 'react-router-dom';
import WelcomePage from './modules/WelcomePage/WelcomePage';
import MainPage from './components/pages/main/MainPage.tsx';
import VideoPostPage from './components/pages/videoPage/videoPostPage';
import UserCabinet from './modules/UserCabinet/UserCabinet';
import RegistrationPage from './components/pages/RegistrationPage/RegistrationPage';
import ClearUserService from './modules/WelcomePage/ClearUserService/ClearUserService';
import UserVideoPage from './components/pages/userVideo/userVideoPage';
import PrivateMessagePage from './components/pages/PrivateMessagePage/PrivateMessagePage';
import VkLogin from './modules/WelcomePage/VkLogin/VkLogin';
import VkLoginName from './modules/WelcomePage/VkLogin/VkLoginName';
import UserVideoArchive from './components/pages/userVideoArchive/userVideoArchive';
import { ENV } from './constants/constants';
import { HashRouter as Router } from 'react-router-dom';

export default function AppRouter() {

    

    function routeEnrichEnv(route) {
        console.log('rOUTe:',`${ENV}/${route}`)
        return `${ENV}/${route}`
    }

    function rootPathEnrichEnv(route) {
        console.log('ROOT', `/${ENV}/${route}`)
        return `/${ENV}/${route}`
    }
        

    
  return (
    <div>
        <Routes>
            {/* <Route path='/' element={<Navigate replace to={`/${ENV}`}/>}/>
            <Route path='/login' element={<Navigate replace to={`/${ENV}`}/>}/>
            <Route path={`/${ENV}`} exact element={<WelcomePage/>} />

            <Route path='/main' element={<Navigate replace to={`/${ENV}/main`}/>}/>
            <Route path={`/${ENV}/main`} exact element={<MainPage/>} />

            <Route path='/lk' element={<Navigate replace to={`/${ENV}/lk`}/>}/>
            <Route path={`/${ENV}/lk`} exact element={<UserCabinet/>} />

            <Route path="/video/:id" exact element={<VideoPostPage/>}/>
            <Route path='/login/registration' exact element={<RegistrationPage/>} />
            <Route path='/userclean' exact element={<ClearUserService/>}/>
            <Route path='/userVideoPage' exact element={<UserVideoPage/>}/>
            <Route path='/userVideoArchive' exact element={<UserVideoArchive/>} />        
            <Route path='/privateMessages' exact element={<PrivateMessagePage/>} />
            <Route path='/login/:params' exact element={<VkLogin />} />
            <Route path='/retrieveName/:params' exact element={<VkLoginName />} /> */}

            <Route path='/' element={<Navigate replace to='/login'/>}/>
            <Route path='/login' exact element={<WelcomePage/>} />
            <Route path='/main' exact element={<MainPage/>} />
            {/* <Route path={`/${ENV}/#/lk/`} element={<UserCabinet/>} /> */}
            <Route path='/lk' exact element={<UserCabinet/>} />
            <Route path="/video/:id" exact element={<VideoPostPage/>}/>
            <Route path='/login/registration' exact element={<RegistrationPage/>} />
            
            {/* <Route path={`/${ENV}/#/privateMessages/`} exact element={<PrivateMessagePage/>} /> */}
            <Route path='/privateMessages' exact element={<PrivateMessagePage/>} />


            <Route path='/userclean' exact element={<ClearUserService/>}/>
            <Route path='/userVideoPage' exact element={<UserVideoPage/>}/>
            <Route path='/userVideoArchive' exact element={<UserVideoArchive/>} />        
        
            <Route path='/login/:params' exact element={<VkLogin />} />
            <Route path='/retrieveName/:params' exact element={<VkLoginName />} />


            {/* <Route path='login/' element={<Navigate replace to={routeEnrichEnv('')}/>}/>
            <Route path='/' element={<Navigate replace to={routeEnrichEnv('')}/>}/>
            <Route path={routeEnrichEnv('')} element={<WelcomePage/>} />
            <Route path={routeEnrichEnv('registration/')} element={<RegistrationPage/>} />
            <Route path='/login/:params' element={<VkLogin />} />
            
            <Route path={`main/`} element={<MainPage/>} />
            <Route path={`/main/`} element={<MainPage/>} />
            <Route path={`/${ENV}/main/`} element={<MainPage/>} />

            <Route path={`lk/`} element={<UserCabinet/>} />
            <Route path={`/lk/`} element={<UserCabinet/>} />
            <Route path={`/${ENV}/#/lk/`} element={<UserCabinet/>} />

            <Route path="video/:id" element={<VideoPostPage/>}/>

            <Route path='userclean/' element={<Navigate replace to={rootPathEnrichEnv('userclean/')}/>}/>
            <Route path={rootPathEnrichEnv('userclean/')} element={<ClearUserService/>}/>

            <Route path='userVideoPage/' element={<Navigate replace to={rootPathEnrichEnv('userVideoPage/')}/>}/>
            <Route path={routeEnrichEnv('userVideoPage/')} element={<UserVideoPage/>}/>
            <Route path={routeEnrichEnv('userVideoArchive/')} element={<UserVideoArchive/>} />    

            <Route path={`privateMessages/`} element={<Navigate replace to={rootPathEnrichEnv('privateMessages/')}/>}/>
            <Route path={rootPathEnrichEnv('privateMessages/')} element={<PrivateMessagePage/>} />


            <Route path='/retrieveName/:params' element={<VkLoginName />} /> */}
        </Routes>
    </div>
  )
}
