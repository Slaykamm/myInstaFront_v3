import { createStore, combineReducers, applyMiddleware } from "redux";
import sideBarShow from './sideBarReducer.ts'
import isActualUser from './isActualUser.ts'
import asyncUsersRequest from './asyncUsersRequest'
import getPreview from './getPreview.ts'
import getComments from './getComments'
import usersDict from "./usersDict.ts";
import getVideo from "./getVideo";
import IsErrorAPI from "./isErrorAPI";
import UserToken from "./userToken";
import verifyUser from "./verifyUser";
import videoOwnerUser from "./videoOwnerUser";
import getPrivateRooms from "./getPrivateRooms";
import privateRoomMessages from "./privateRoomMessages";
import postUserRoom from "./postUserRoom";
import postUserPrivate from "./postUserPrivate";
import putToBaseReducer from "./putToBaseReducer";
import deleteFromBaseReducer from "./deleteFromBaseReducer";
import postToBaseReducer from "./postToBaseReducer";
import getCommentsWithQuotationsReducer from "./getCommentsWithQuotationsReducer";
import postCommentsWithQuotationsReducer from "./postCommentsWithQuotationsReducer";
import postToBaseMediaReducer from "./postToBaseMediaReducer";
import createNewUserReducer from "./createNewUserReducer";
import changeUserPasswordReducer from "./changeUserPasswordReducer";
import createNewVideoReducer from "./createNewVideoReducer";
import putNewUserDataReducer from "./putNewUserDataReducer";
import getPrivateRoomsMultyUsersReducer from "./getPrivateRoomsMultyUsersReducer";
import setWsReducer from "./setWsReducer";
import getUserAvatarReducer from "./getUserAvatarReducer";
import setUserConfirmationsReducer from "./setUserConfirmationsReducer";
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";


export const rootReducer = combineReducers({
    sideBarShow,
    isActualUser,
    asyncUsersRequest,
    getPreview,
    getComments,
    usersDict,
    getVideo,
    verifyUser,
    videoOwnerUser,
    getPrivateRooms,
    privateRoomMessages,
    postUserRoom,
    postUserPrivate,
    putToBaseReducer,
    deleteFromBaseReducer,
    postToBaseReducer,
    getCommentsWithQuotationsReducer,
    postCommentsWithQuotationsReducer,
    postToBaseMediaReducer,
    createNewUserReducer,
    changeUserPasswordReducer,
    createNewVideoReducer,
    putNewUserDataReducer,
    getPrivateRoomsMultyUsersReducer,
    setWsReducer,
    IsErrorAPI,  //так и не нашел применения пока. потом можно удалить TODO
    UserToken,
    getUserAvatarReducer,
    setUserConfirmationsReducer,
    form: formReducer
})


export const store=createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))


