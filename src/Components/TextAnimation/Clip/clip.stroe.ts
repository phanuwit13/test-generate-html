import { fontFamilyList } from 'Utils/constants'
import { create } from 'zustand'

type GlitchStore = {
  text: string
  setText: (value: string) => void
  fontSize: string
  setFontSize: (value: string) => void
  fontWeight: string
  setFontWeight: (value: string) => void
  fontFamily: string
  setFontFamily: (value: string) => void
  textColorStart: string
  setTextColorStart: (value: string) => void
  textColorCenter: string
  setTextColorCenter: (value: string) => void
  textColorEnd: string
  setTextColorEnd: (value: string) => void
}

const useGlitchStore = create<GlitchStore>()((set) => ({
  text: '',
  setText: (value) => set(() => ({ text: value })),
  fontSize: '80',
  setFontSize: (value) => set(() => ({ fontSize: value })),
  fontWeight: '600',
  setFontWeight: (value) => set(() => ({ fontWeight: value })),
  fontFamily: fontFamilyList[0],
  setFontFamily: (value) => set(() => ({ fontFamily: value })),
  textColorStart: '#095fab',
  setTextColorStart: (value) => set(() => ({ textColorStart: value })),
  textColorCenter: '#25abe8',
  setTextColorCenter: (value) => set(() => ({ textColorCenter: value })),
  textColorEnd: '#57d75b',
  setTextColorEnd: (value) => set(() => ({ textColorEnd: value })),
}))

export { useGlitchStore }

