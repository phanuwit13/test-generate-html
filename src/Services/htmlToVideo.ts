import { apiConstant } from 'Utils/config'
import axios from 'axios'

const instance = axios.create({
  baseURL: apiConstant.apiUrl,
})

const htmlToVideo = {
  generateVideo: ({
    file,
    width,
    height,
  }: {
    file: Blob
    width: number
    height: number
  }) => {
    console.log('apiConstant.baseApi', process.env)
    const data = new FormData()
    data.append('FileData', file)
    data.append('width', width.toString())
    data.append('height', height.toString())
    return instance.post('/convert', data, {
      responseType: 'blob', // This tells Axios to treat the response as a binary blob
    })
  },
}

export { htmlToVideo }

