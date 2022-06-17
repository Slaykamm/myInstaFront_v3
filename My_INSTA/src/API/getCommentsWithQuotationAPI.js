import axios from "axios";
import { getCommentsWithQuotationAction } from "../redux/actions/getCommentsWithQuotationAction";
import { filter, flatten } from 'lodash'


//ф--------------функция для асинхронного запроса
export const getCommentsWithQuotationAPI = (videoID, userToken) => {
    return function(dispatch) {
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userToken                    
            }
        }

        const  commentsAPI = axios.get(
            `http://127.0.0.1:8000/api/comments/?video=${videoID}`, params);
            

        commentsAPI.then(response => {
            if (response.data){
                const getQuotationsForCommentAPI = axios.get(
                    `http://127.0.0.1:8000/api/quotations/?video=${videoID}`, params
                );
                    
                getQuotationsForCommentAPI.then(resp => {
                    const enrichmentComments = response.data.map(comment => {
                        return {
                            ...comment, 
                            ...{'quote': 
                                filter(resp.data, {'baseComment': comment.id })[0]
                            }
                        }
                    })
                    dispatch(getCommentsWithQuotationAction(enrichmentComments)) 
                })    
            }

        })

        commentsAPI.catch((err) => {
            console.log("mi tut?")
              dispatch(getCommentsAction(err.response))
        })
    }
}

// async USAGE
// return async function(dispatch) {
//     const  commentsAPI = await axios.get(url...);

// return enrichment(commentsAPI)



// async function enrichment(response) {
//     const result = response
//     console.log('result', result)
// }














// То что ниже - попытка реализовать сложный запрос, где инжектируются в ответа данные из другого запроса для формирования конечного сложного объекта. 
// Отказался - решение не удачное. Требуется для специфичных задач.

// import { get, merge } from 'lodash'

// //ф--------------функция для асинхронного запроса
// export const getCommentsThunkAPI = (videoID, userToken) => {
//     return function(dispatch) {


//         const params = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': userToken                    
//             }
//         }
//         const outObj = {
//             data: [],
//             status: '',
//             quotes: []
//         }

        

//         const commentsAPI = axios.get(
//             `http://127.0.0.1:8000/api/comments/?video=${videoID}`, params);
                   
//         commentsAPI.then(response => {
//             //диспатчим ActionCreator

//           //  console.log('responce', response)

//             outObj.data.push(response.data)


//             get(response,['data']).map((quotes)=>{
//             //        console.log('quotes', quotes)
//                     const getQuotesAPI = axios.get(
//                         `http://127.0.0.1:8000/api/quotations/?baseComment=${quotes.id}`, params)
//                         getQuotesAPI.then(resp =>{
//                       //      console.log('resp', resp)
//                        // response.data[quotes.id-1].quotedCommentID=[]
//                         resp.data.map(quotedID =>{
//                             response.data[quotes.id-1].quotedCommentID.push(quotedID.quotedCommentID)  
//                         })
//                    //     console.log('responce2', response) 
//                     })
//                 }
//             )
//             dispatch(getCommentsAction(response)) 
//         })

//         commentsAPI.catch((err) => {
//               dispatch(getCommentsAction(err.response))

              
//         })



    




//     }
// }


