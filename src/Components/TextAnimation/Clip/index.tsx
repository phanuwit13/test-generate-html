import { useEffect, useRef } from 'react'
import { useGlitchStore } from './clip.stroe'

const Clip = () => {
  const {
    text,
    fontSize,
    fontFamily,
    fontWeight,
    textColorCenter,
    textColorStart,
    textColorEnd,
  } = useGlitchStore()
  const ref = useRef<any>(null)
  const refContainer = useRef<any>(null)

  useEffect(() => {
    ref.current.style.background = `linear-gradient(to right, ${textColorStart} 10%, ${textColorCenter} 50%, ${textColorEnd} 60%)`
    const currentHtml = refContainer.current.innerHTML
    refContainer.current.innerHTML = ''
    console.log('currentHtml', currentHtml)
    setTimeout(() => {
      
      refContainer.current.innerHTML = currentHtml
    }, 1000);
    // ref.current.style.background = `linear-gradient(to right, ${textColorStart} 10%, ${textColorCenter} 50%, ${textColorEnd} 60%)`
  }, [textColorCenter, textColorStart, textColorEnd])

  return (
    <div ref={refContainer}>
      <div
        ref={ref}
        className='clip-animate'
        style={{
          animation: 'textclip 1.5s linear infinite',
          color: '#fff',
          fontSize: `${fontSize}px`,
          textTransform: 'uppercase',
          fontWeight: fontWeight,
          fontFamily: `'${fontFamily}', sans-serif`,
          // background: `linear-gradient(to right, ${textColorStart} 10%, ${textColorCenter} 50%, ${textColorEnd} 60%)`,
          backgroundSize: '200% auto',
          backgroundClip: 'text !important',
          WebkitBackgroundClip: 'text !important',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
        }}
      >
        {text || 'Display Text'}
      </div>
    </div>
  )
}

export default Clip
