import { LEFT_SIDEBAR_SHOW, LEFT_SIDEBAR_HIDE } from "../../constants/constants";



const initialState: boolean = false;

export enum SideBarShowTypes {
    LEFT_SIDEBAR_SHOW = 'LEFT_SIDEBAR_SHOW',
    LEFT_SIDEBAR_HIDE = 'LEFT_SIDEBAR_HIDE'
}

export interface ISideBarShowActions {
    type: SideBarShowTypes.LEFT_SIDEBAR_SHOW | SideBarShowTypes.LEFT_SIDEBAR_HIDE
    payload?: boolean   
}

function sideBarShow(state=initialState, action: ISideBarShowActions) {

    switch (action.type) {
        case SideBarShowTypes.LEFT_SIDEBAR_SHOW:
            return true;
    
        case SideBarShowTypes.LEFT_SIDEBAR_HIDE:
            return false;
    
    default:
        return state
    }
}

export default sideBarShow