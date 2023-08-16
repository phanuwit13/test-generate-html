import { Listbox, Transition } from '@headlessui/react'
import Input from 'Components/Input'
import { useGeneralStore } from 'Store/general'
import { fontFamilyList } from 'Utils/constants'
import { addStylesheetRules, getStyle, replaceSrcImage } from 'Utils/util'
import { ChevronsUpDown } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useGraciasStore } from '../gracias.stroe'

type GraciasSettingProps = {
  handleRenderVideo: (htmlFileData: Blob, cssFileData: Blob) => void
  contentHtml: React.MutableRefObject<any>
  imageBg: React.MutableRefObject<any>
}

const GraciasSetting = ({
  handleRenderVideo,
  contentHtml,
  imageBg,
}: GraciasSettingProps) => {
  const {
    text,
    fontSize,
    fontFamily,
    fontWeight,
    setFontFamily,
    setText,
    setFontSize,
    setFontWeight,
    strokeColor,
    strokeWidth,
    setStrokeColor,
    setStrokeWidth,
  } = useGraciasStore()

  const { backgroundType, displayBackgroundFile } = useGeneralStore()

  const [startColor, setStartColor] = useState('#94deeb')
  const [endColor, setEndColor] = useState('#94deeb00')

  const handleChangeKeyFrame = (startColor: string, endColor: string) => {
    let keyframes = `
    @keyframes gracias-animate {
      0% {
        stroke-dasharray: 0 50%;
        stroke-dashoffset: 20%;
        fill: ${startColor};
      }
    
      100% {
        stroke-dasharray: 50% 0;
        stroke-dashoffstet: -20%;
        fill: ${endColor};
      }
    }`

    addStylesheetRules(keyframes)
  }

  const handleContentHtml = async () => {
    const html = contentHtml.current.innerHTML
    const currentImage = imageBg.current.src
    const pageHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="./style.css">
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              clifford: '#da373d',
            }
          }
        }
      }
    </script>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@200;400;600;700&family=Athiti:wght@200;400;600;700&family=Bai+Jamjuree:wght@200;400;600;700&family=Chakra+Petch:wght@300;400;600;700&family=Charm:wght@400;700&family=Charmonman:wght@400;700&family=Chonburi&family=Fahkwang:wght@200;400;600;700&family=IBM+Plex+Sans+Thai+Looped:wght@200;400;600;700&family=IBM+Plex+Sans+Thai:wght@200;400;600;700&family=Itim&family=K2D:wght@200;400;600;700&family=Kanit:wght@200;400;600;700&family=KoHo:wght@200;400;600;700&family=Kodchasan:wght@200;400;600;700&family=Krub:wght@200;400;600;700&family=Maitree:wght@200;400;600&family=Mali:wght@200;400;600;700&family=Mitr:wght@200;400;500;600&family=Niramit:wght@200;300;400;600&family=Noto+Sans+Thai+Looped:wght@200;400;600;700&family=Noto+Sans+Thai:wght@200;400;600;700&family=Noto+Serif+Thai:wght@200;400;600;700&family=Pattaya&family=Pridi:wght@200;400;600&family=Prompt:wght@200;400;600;700&family=Sarabun:wght@200;400;600;700&family=Sriracha&family=Srisakdi:wght@400;700&family=Taviraj:wght@200;400;600;700&family=Thasadith:wght@400;700&family=Trirong:wght@200;400;600;700&display=swap');
    *{
      padding:0;
      margin:0;
    }
    @keyframes gracias-animate {
      0% {
        stroke-dasharray: 0 50%;
        stroke-dashoffset: 20%;
        fill: ${startColor};
      }
    
      100% {
        stroke-dasharray: 50% 0;
        stroke-dashoffstet: -20%;
        fill: ${endColor};
      }
    }
    </style>
    </head>
    <body>
      ${
        backgroundType === 'bg-file' && displayBackgroundFile
          ? replaceSrcImage(
              currentImage,
              html,
              `./images/${displayBackgroundFile.name}`
            )
          : html
      }
    </body>
    </html>
    `
    // console.log('pageHTML', pageHTML)
    const htmlFileData = new Blob([pageHTML], { type: 'data:attachment/text,' })
    const cssFileData = new Blob([await getStyle()], {
      type: 'data:attachment/text,',
    })

    return {
      htmlFileData,
      cssFileData,
    }
  }

  const handleGenerateVideo = async () => {
    const file = await handleContentHtml()
    handleRenderVideo(file.htmlFileData, file.cssFileData)
  }

  useEffect(() => {
    handleChangeKeyFrame(startColor, endColor)
  }, [startColor, endColor])

  return (
    <>
      <Input
        label='Display Text'
        name='display-text'
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
      <fieldset>
        <label
          htmlFor='displayText'
          className='block mb-2 text-sm font-medium text-gray-900'
        >
          Text Animation
        </label>
        <Listbox
          onChange={(e) => {
            setFontFamily(e)
          }}
        >
          <div className='relative mt-1'>
            <Listbox.Button className='relative bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
              <span className='block truncate text-start min-h-[20px]'>
                {fontFamily}
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronsUpDown
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {fontFamilyList.map((item) => {
                  return (
                    <div key={`font-${item}`}>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {item}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    </div>
                  )
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </fieldset>
      <Input
        label='Font Size'
        name='display-text-size'
        value={fontSize}
        onChange={(e) => {
          setFontSize(e.target.value)
        }}
      />
      <Input
        label='Font Weight'
        name='display-font-weight'
        value={fontWeight}
        onChange={(e) => {
          setFontWeight(e.target.value)
        }}
      />
      <Input
        label='Stroke Weight'
        name='font-stroke'
        value={strokeWidth}
        onChange={(e) => {
          setStrokeWidth(e.target.value)
        }}
      />
      <fieldset>
        <label
          htmlFor='displayTextColor'
          className='block mb-2 text-sm font-medium text-gray-900'
        >
          Display Text Color
        </label>
        <div className='flex'>
          <input
            type='color'
            className='h-[42px] bg-white border border-gray-300 text-gray-900 border-r-0 rounded-l-lg p-1'
            value={strokeColor || '#000000'}
            onChange={(e) => {
              setStrokeColor(e.target.value)
            }}
          />
          <input
            type='text'
            className='bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
            value={strokeColor || '#000000'}
            onChange={(e) => {
              setStrokeColor(e.target.value)
            }}
          />
        </div>
      </fieldset>
      <fieldset>
        <label
          htmlFor='displayTextColor'
          className='block mb-2 text-sm font-medium text-gray-900'
        >
          Text Color Start
        </label>
        <div className='flex'>
          <input
            type='color'
            className='h-[42px] bg-white border border-gray-300 text-gray-900 border-r-0 rounded-l-lg p-1'
            value={startColor || '#000000'}
            onChange={(e) => {
              setStartColor(e.target.value)
            }}
          />
          <input
            type='text'
            className='bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
            value={startColor || '#000000'}
            onChange={(e) => {
              setStartColor(e.target.value)
            }}
          />
        </div>
      </fieldset>
      <fieldset>
        <label
          htmlFor='displayTextColor'
          className='block mb-2 text-sm font-medium text-gray-900'
        >
          Text Color End
        </label>
        <div className='flex'>
          <input
            type='color'
            className='h-[42px] bg-white border border-gray-300 text-gray-900 border-r-0 rounded-l-lg p-1'
            value={endColor || '#000000'}
            onChange={(e) => {
              setEndColor(e.target.value)
            }}
          />
          <input
            type='text'
            className='bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
            value={endColor || '#000000'}
            onChange={(e) => {
              setEndColor(e.target.value)
            }}
          />
        </div>
      </fieldset>
      <div className='col-span-full'>
        <button
          type='button'
          onClick={handleGenerateVideo}
          className='w-full text-white bg-[#93D600] hover:opacity-[0.9] focus:ring-4 focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 mt-[20px]'
        >
          Render Video
        </button>
      </div>
    </>
  )
}

export default GraciasSetting
