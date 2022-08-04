import { UNVERIFYED_USER_ADD, VERIFYED_USER_ADD } from "../../constants/constants";

export interface IisActualUser {
    username: string
}

export enum isActualUserEnum {
    UNVERIFYED_USER_ADD = 'UNVERIFYED_USER_ADD',
    VERIFYED_USER_ADD = 'VERIFYED_USER_ADD'
}

export interface IisActualUserAction {
    type: isActualUserEnum.UNVERIFYED_USER_ADD | isActualUserEnum.VERIFYED_USER_ADD
    payload?: IisActualUser 
} 

const initialState: IisActualUser = {username: 'None'};
//TODO вообще это надо убрать будет
function isActualUser(state=initialState, action: IisActualUserAction) {

    switch (action.type) { 
        case UNVERIFYED_USER_ADD:
            return {...action.payload};
    
        case VERIFYED_USER_ADD:
            return {...action.payload, isVerifyed: true};
    
    default:
        return state
    }
}

export default isActualUser 