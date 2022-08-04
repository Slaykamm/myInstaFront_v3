export interface IState = {
    initialState: boolean,
    isActualUser:  {
        username: string
    },
    asyncUsersRequest: [],
    getPreview: IPreview[],

}


const initialState = {
    sideBarShow: false,
    isActualUser: {},
    getPreview: [],
    getComments: [],
    usersDict: [],
    getVideo: {},
    verifyUser: [],
    videoOwnerUser: [],
    getPrivateRooms: [],
    privateRoomMessages: [],
    postUserRoom: [],
    postUserPrivate: [],
    putToBaseReducer: [],
    deleteFromBaseReducer: [],
    postToBaseReducer: [],
    getCommentsWithQuotationsReducer: [],
    postCommentsWithQuotationsReducer: [],
    postToBaseMediaReducer: [],
    createNewUserReducer: [],
    changeUserPasswordReducer: {},
    createNewVideoReducer: [],
    putNewUserDataReducer: [],
    getPrivateRoomsMultyUsersReducer: [],
    setWsReducer: [],
    IsErrorAPI: [],
    UserToken: [],
    getUserAvatarReducer: [],
    setUserConfirmationsReducer: {},
    form: {},
}



const initialStateStore = {
    sideBarShow: false,
    isActualUser: {
      username: 'Cat'
    },
    asyncUsersRequest: [],
    getPreview: [
      {
        id: 1,
        title: 'Первый ролик от кошки',
        video: 'http://194.226.49.38:8000/media/video/cat.mp4',
        image: 'http://194.226.49.38:8000/media/preview/cat.jpg',
        rating: 0,
        description: 'Маленький котенок и ципленок вместе играют. Это названием специально оооочень долгое, чтобы проверить длину описания',
        create_at: '2022-07-17T15:14:54.441832Z',
        archived: false,
        deleted: false,
        author: 2
      },
    ],
    getComments: [],
    usersDict: [
      {
        id: 9,
        last_login: '2022-07-17T16:11:25.529966Z',
        username: 'Andele',
        first_name: 'Andrrrrrrr',
        last_name: 'Iiiiivvva',
        email: 'destpoch@gmail.com',
        is_active: true,
        date_joined: '2022-07-17T16:11:25.154628Z',
        avatar: 'http://194.226.49.38:8000/media/avatar/scare',
        phone: '1658074285.424334',
        socialAcc: true,
        author: 9,
        userID: 7,
        isEmailConfirmed: false,
        isPhoneConformed: false
      },
    ],
    getVideo: {},
    verifyUser: [
      {
        status: 401
      }
    ],
    videoOwnerUser: [],
    getPrivateRooms: [],
    privateRoomMessages: [],
    postUserRoom: [],
    postUserPrivate: [],
    putToBaseReducer: [],
    deleteFromBaseReducer: [],
    postToBaseReducer: [],
    getCommentsWithQuotationsReducer: [],
    postCommentsWithQuotationsReducer: [],
    postToBaseMediaReducer: [],
    createNewUserReducer: [],
    changeUserPasswordReducer: {},
    createNewVideoReducer: [],
    putNewUserDataReducer: [],
    getPrivateRoomsMultyUsersReducer: [],
    setWsReducer: [],
    IsErrorAPI: [],
    UserToken: [
      {
        data: {
          key: 'c8b40c091d6f4a194bec1b6b72df4dc9bec8c431'
        },
        status: 200
      }
    ],
    getUserAvatarReducer: [],
    setUserConfirmationsReducer: {
      isEmailCOnfirmed: false,
      isPhoneConfirmed: false
    },
    form: {}
  }
