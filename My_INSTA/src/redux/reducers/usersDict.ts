import { USERS_DICTIONARY } from "../../constants/constants";

interface IUserDict {
    id: number,
    last_login: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    is_active: boolean,
    date_joined: string,
    avatar: string,
    phone: string,
    socialAcc: boolean,
    author: number,
    userID: number,
    isEmailConfirmed: boolean,
    isPhoneConformed: boolean
}

export interface IUserDictArray extends Array<IUserDict>{}

const initialState: IUserDictArray = [{
    id: null,
    last_login: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_active: false,
    date_joined: '',
    avatar: '',
    phone: '',
    socialAcc: false,
    author: null,
    userID: null,
    isEmailConfirmed: false,
    isPhoneConformed: false
}];


export  enum UserDictTypes {
    USERS_DICTIONARY = 'USERS_DICTIONARY'
  }

  export interface IUserDictAction {
      type: UserDictTypes.USERS_DICTIONARY
      payload?: IUserDictArray
  }

export type UserDictAction = IUserDictAction

function usersDict(state=initialState, action: UserDictAction): IUserDictArray {

    switch (action.type) {
        case USERS_DICTIONARY:
            return [...action.payload];
    
    default:
        return state
    }
}

export default usersDict 