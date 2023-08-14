import BeatLoader from 'react-spinners/BeatLoader'
import { useLoadingPageStore } from './store'

const LoadingPage = () => {
  const { isLoading } = useLoadingPageStore()
  return isLoading ? (
    <div className='w-full h-[100vh] top-0 left-0 fixed flex justify-center items-center'>
      <div className='backdrop-opacity-10 backdrop-invert bg-black/50 absolute top-0 left-0 w-full h-[100vh]'></div>
      <BeatLoader color='#93D600' size={20} />
    </div>
  ) : (
    <></>
  )
}

export default LoadingPage
