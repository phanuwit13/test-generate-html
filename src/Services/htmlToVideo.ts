import { apiConstant } from 'Utils/config'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'https://html5animationtogif.com/api',
})

const htmlToVideo = {
  UploadZip: (file: Blob) => {
    const data = new FormData()
    data.append('FileData', file)
    return instance.post('/uploadzip.ashx', data)
  },
  convertToVideo: (id: string) => {
    const data = new FormData()
    data.append('clientid', apiConstant.clientId)
    data.append('apikey', apiConstant.apiKey)
    data.append('creativeid', id)
    data.append('width', '300')
    data.append('height', '600')
    data.append('duration', '10')
    data.append('fps', '60')
    data.append('audio', 'N')
    data.append('webhookurl', '')
    data.append('creativefitoption', 'center')
    data.append('bitratevalue', '17')
    return instance.post('/converttovideo.ashx', data)
  },
  localConvertToVideo: ({
    file,
    width,
    height,
  }: {
    file: Blob
    width: number
    height: number
  }) => {
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

