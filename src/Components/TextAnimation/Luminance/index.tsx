import { useLuminanceStore } from './luminance.stroe'

const Luminance = () => {
  const { text, fontSize, fontFamily, fontWeight, fontColor } =
    useLuminanceStore()

  return (
    <div
      id='luminance-animate'
      style={{
        background:
          '50% 100% / 50% 50% no-repeat\nradial-gradient(ellipse at bottom, #fff, transparent, transparent)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: fontColor,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        fontFamily: `"${fontFamily}", sans-serif`,
        animation: 'glow 2.5s linear infinite 2s',
      }}
    >
      {text || 'Display Text'}
    </div>
  )
}

export default Luminance
