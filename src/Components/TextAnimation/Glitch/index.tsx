import { useGlitchStore } from './glitch.stroe'

const Glitch = () => {
  const { text, fontSize, fontFamily, fontWeight, fontColor } = useGlitchStore()

  return (
    // <div
    //   className='patterns'
    //   style={{
    //     height: Number(fontSize) * 1.8,
    //   }}
    // >
    //   <svg width='100%' height='100%'>
    //     <defs>
    //       <pattern
    //         id='polka-dots'
    //         x='0'
    //         y='0'
    //         width='100'
    //         height='100'
    //         patternUnits='userSpaceOnUse'
    //       >
    //         <circle fill='#be9ddf' cx='25' cy='25' r='3'></circle>
    //       </pattern>
    //     </defs>
    //     <text
    //       x='50%'
    //       y='60%'
    //       strokeWidth={strokeWidth}
    //       textAnchor='middle'
    //       style={{
    //         fontSize: `${fontSize}px`,
    //         fontFamily: `'${fontFamily}', sans-serif`,
    //         letterSpacing: '4px',
    //         stroke: strokeColor,
    //         fontWeight: fontWeight,
    //         // strokeWidth: `${}px`,
    //         WebkitTextStrokeWidth: strokeWidth,
    //         animation: 'gracias-animate 5s infinite alternate',
    //       }}
    //     >
    //       {text || 'Display Text'}
    //     </text>
    //   </svg>
    // </div>
    <div
      title={text || 'Display Text'}
      id='glitch-animate'
      style={{
        fontSize: `${fontSize}px`,
        fontFamily: `'${fontFamily}', sans-serif`,
        letterSpacing: '4px',
        color: fontColor,
        fontWeight: fontWeight,
        animation: 'glitch 1s linear infinite',
        position: 'relative',
      }}
    >
      {text || 'Display Text'}
    </div>
  )
}

export default Glitch
