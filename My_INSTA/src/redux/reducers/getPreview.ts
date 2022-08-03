import { VIDEO_PREVIEWS_THUNK } from "../../constants/constants"
import { getPreviewAction, GetPreviewStateArray } from "./getPreview.type"



const initialState: GetPreviewStateArray = [
  {
    id: null,
    title: '',
    video: '',
    image: '',
    rating: null,
    description: '',
    create_at: '',
    archived: false,
    deleted: false,
    author: null,
  }
]


function getPreview(state=initialState, action:getPreviewAction): GetPreviewStateArray {
  console.log('action', action)
    switch (action.type){

        case VIDEO_PREVIEWS_THUNK:
            return [...action.payload]
        default:
            return state
    }
    
}

export default getPreview