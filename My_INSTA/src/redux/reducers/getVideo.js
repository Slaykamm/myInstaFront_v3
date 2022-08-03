import { GET_VIDEO } from "../../constants/constants"
import { initialState } from "./initialState.ts"
// const initialState = {}
//{id: '', date: '', authorId: '', authorName: '', content: ''}


function getVideo(state=initialState, action) {
    switch (action.type){

        case GET_VIDEO:

            return {...action.payload}
        default:
            return state
    }
    
}

export default getVideo