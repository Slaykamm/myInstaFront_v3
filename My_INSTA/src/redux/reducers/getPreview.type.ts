export interface GetPreviewState {
    id: number,
    title: string,
    video: string,
    image: string,
    rating: number,
    description: string,
    create_at: string,
    archived: boolean,
    deleted: boolean,
    author: number
 }
 
export interface GetPreviewStateArray extends Array<GetPreviewState>{}
 
export  enum gerPreviewTypes {
   VIDEO_PREVIEWS_THUNK = 'VIDEO_PREVIEWS_THUNK'
 }
 
export interface IgetPreviewAction {
   type: gerPreviewTypes.VIDEO_PREVIEWS_THUNK
   payload?: GetPreviewStateArray
 }
 
export type getPreviewAction = IgetPreviewAction
 