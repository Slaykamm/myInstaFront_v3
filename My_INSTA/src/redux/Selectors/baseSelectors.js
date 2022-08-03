import { createSelector } from "reselect"
import { filter, get } from 'lodash'



export const getComments = state => {
    if (state.getComments){
        return state.getComments
    }
}


export const getPreviewSelector = state => {
    console.log('111111111',state)
    if (state.getPreview) {
        return state.getPreview
    }
}


export const getAllCommentsSelectedbyVideo = createSelector(getComments, comments => {
        return comments
    }
)

const selectShopItems = state => state.shop.items

const selectSubtotal = createSelector(selectShopItems, items =>
    items.reduce((subtotal, item) => subtotal + item.value, 0)
  )



export const getUsersDict = (state) => {
    return state.usersDict
} 

export const getUsersDictFromBase = createSelector(
    getUsersDict,
    
)

export const getUsersDictFromState = createSelector(
    getUsersDict,
    (dict) => {
        console.log('test',dict)
        return dict
    }
)



export const getUserToken = (state) => {
    return state.userToken
} 

export const getUserRoom = (state) => {
    return state.postUserRoom
} 

export const getPutToBaseResult = (state) => {
    return state.putToBaseReducer
} 

export const getDeleteFromBaseResult = (state) => {
    return state.deleteFromBaseReducer
} 

export const getPostToBaseResult = (state) => {
    return state.postToBaseReducer
} 

export const getCommentsWithQuotationsResult = (state) => {
    return state.getCommentsWithQuotationsReducer
} 

export const getPostCommentsWithQuotationsResult = (state) => {
    return state.postCommentsWithQuotationsReducer
} 

export const getPostToBaseMediaResult = (state) => {
    return state.postToBaseMediaReducer
} 

export const getCreateEmptyUserResult = (state) => {
    return state.createNewUserReducer
} 

export const getChangePasswordResult = (state) => {
    return state.changeUserPasswordReducer
} 

export const getNewVideoResult = (state) => {
    return state.createNewVideoReducer
} 

export const getPutNewUserDataResult = (state) => {
    return state.putNewUserDataReducer
} 


export const getWs = (state) => {
    return state.setWsReducer
} 


export const getUserAvatarResult = (state) => {
    return state.getUserAvatarReducer
} 

