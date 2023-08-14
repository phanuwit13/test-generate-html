import { Listbox, Transition } from '@headlessui/react'
import { DragBox } from 'Components/DragBox'
import Input from 'Components/Input'
import LoadingPage from 'Components/LoadingPage'
import { useLoadingPageStore } from 'Components/LoadingPage/store'
import { htmlToVideo } from 'Services/htmlToVideo'
import { animationList } from 'Utils/constants'
import saveAs from 'file-saver'
import JSZip from 'jszip'
import { ChevronsUpDown } from 'lucide-react'
import { Fragment, useCallback, useRef, useState } from 'react'
import type { XYCoord } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { Controller, useForm } from 'react-hook-form'

interface FormInput {
  displayText: string
  displayTextFontSize: number
  displayTextColor: string
  displayBackground: string
  displayBackgroundFile: File
  backgroundType: string
  displayTextPosition: string
  displayWidth: number
  displayHeight: number
  textAnimationType: string
  textAnimationDuration: number
  textAnimationTime: number
  textAnimationLoop: boolean
}

function App() {
  const ref = useRef<any>(null)
  const refImageBg = useRef<any>(null)
  const refRender = useRef<any>(null)
  const { setIsLoading } = useLoadingPageStore()

  const [boxes, setBoxes] = useState<{
    top: number
    left: number
  }>({
    top: 165,
    left: 180,
  })

  const moveBox = useCallback(
    (left: number, top: number) => {
      setBoxes({ left, top })
    },
    [setBoxes]
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(
        item: {
          top: number
          left: number
        },
        monitor
      ) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(left, top)
        return undefined
      },
    }),
    [moveBox]
  )

  const { register, watch, setValue, control } = useForm<FormInput>({
    defaultValues: {
      displayTextPosition: 'topLeft',
      displayWidth: 768,
      displayHeight: 800,
      textAnimationType: animationList['Attention seekers'][0],
      textAnimationDuration: 1,
      displayTextFontSize: 16,
      textAnimationTime: 2,
      backgroundType: 'bg-link',
    },
  })

  const form = {
    displayText: register('displayText'),
    displayTextFontSize: register('displayTextFontSize'),
    displayTextColor: register('displayTextColor'),
    displayBackground: register('displayBackground'),
    displayBackgroundFile: register('displayBackgroundFile'),
    backgroundType: register('backgroundType'),
    displayTextPosition: register('displayTextPosition'),
    displayWidth: register('displayWidth'),
    displayHeight: register('displayHeight'),
    textAnimationType: register('textAnimationType'),
    textAnimationDuration: register('textAnimationDuration'),
    textAnimationTime: register('textAnimationTime'),
    textAnimationLoop: register('textAnimationLoop'),
  }

  const textAnimateOption = Object.keys(animationList)

  const getStyle = () => {
    return fetch('./animate.txt')
      .then((response) => {
        console.log('response', response)
        return response.text()
      })
      .then((textContent) => {
        return textContent
      })
  }

  const replaceSrcImage = (str: string, url: string) => {
    const currentSrc = refImageBg.current.src
    return str.replace(currentSrc, url)
  }
  const replaceDuration = (str: string, duration: number) => {
    return str.replace(
      `animation-duration: ${duration}s`,
      // `animation-duration: ${duration * 4.5}s`
      `animation-duration: ${duration}s`
    )
  }

  const handleConvertToCanvas = async () => {
    setIsLoading(true)
    const contentHtml = replaceDuration(
      ref.current.innerHTML,
      watch('textAnimationDuration')
    )
    var pageHTML = `
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
    </head>
    <body>
      ${
        watch('backgroundType') === 'bg-file' && watch('displayBackgroundFile')
          ? replaceSrcImage(
              contentHtml,
              `./images/${watch('displayBackgroundFile').name}`
            )
          : contentHtml
      }
    </body>
    </html>
    `
    let htmlFileData = new Blob([pageHTML], { type: 'data:attachment/text,' })
    let cssFileData = new Blob([await getStyle()], {
      type: 'data:attachment/text,',
    })

    const zip = new JSZip()
    zip.file('index.html', htmlFileData)
    zip.file('style.css', cssFileData)
    if (
      watch('backgroundType') === 'bg-file' &&
      watch('displayBackgroundFile')
    ) {
      const img = zip.folder('images') as JSZip
      img.file(
        watch('displayBackgroundFile').name,
        watch('displayBackgroundFile')
      )
    }
    zip.generateAsync({ type: 'blob' }).then(async function (content) {
      // await saveAs(content, 'content.zip')

      const res = await htmlToVideo.localConvertToVideo({
        file: content,
        width: watch('displayWidth'),
        height: watch('displayHeight'),
      })
      console.log('res', res)
      const blob = new Blob([res.data], { type: 'video/mp4' })
      await saveAs(blob, 'example.mp4')
      setIsLoading(false)
      // const videoBlobUrl = URL.createObjectURL(res.data.blob())
      // await saveAs(res.data.blob(), 'example.mp4')
    })
  }

  const handleReadFileImage = (file: FileList | null) => {
    if (file?.length) {
      const imageUrl = URL.createObjectURL(file[0])
      setValue('displayBackground', imageUrl)
      setValue('displayBackgroundFile', file[0])
    }
  }

  return (
    <div>
      <div className='flex overflow-x-auto min-h-screen'>
        <div className='p-[20px] min-w-[400px] w-[400px] gap-2 grid grid-cols-1 h-fit'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              inputRef={form.displayWidth.ref}
              label='Width'
              {...form.displayWidth}
            />
            <Input
              inputRef={form.displayHeight.ref}
              label='Height'
              {...form.displayHeight}
            />
          </div>
          <fieldset>
            <label
              htmlFor='displayText'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Background Image Type
            </label>
            <ul className='items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg grid grid-cols-2'>
              <li className='w-full'>
                <fieldset className='flex items-center pl-2.5'>
                  <input
                    id='bg-link'
                    type='radio'
                    {...form.backgroundType}
                    name='backgroundType'
                    value='bg-link'
                    className='w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 cursor-pointer'
                  />
                  <label
                    htmlFor='bg-link'
                    className='w-full py-2.5 ml-2 text-sm font-medium text-gray-900 cursor-pointer'
                  >
                    URL
                  </label>
                </fieldset>
              </li>
              <li className='w-full '>
                <fieldset className='flex items-center pl-2.5'>
                  <input
                    id='bg-file'
                    type='radio'
                    {...form.backgroundType}
                    name='backgroundType'
                    value='bg-file'
                    className='w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 cursor-pointer'
                  />
                  <label
                    htmlFor='bg-file'
                    className='w-full py-2.5 ml-2 text-sm font-medium text-gray-900 cursor-pointer'
                  >
                    File
                  </label>
                </fieldset>
              </li>
            </ul>
          </fieldset>
          <fieldset>
            <label
              htmlFor='displayBackground'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Background
            </label>
            {watch('backgroundType') === 'bg-link' && (
              <Input
                inputRef={form.displayBackground.ref}
                {...form.displayBackground}
              />
            )}
            {watch('backgroundType') === 'bg-file' && (
              <input
                className='block w-full text-sm p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none '
                id='file_input'
                type='file'
                onChange={(e) => {
                  handleReadFileImage(e.target.files)
                }}
              />
            )}
          </fieldset>
          <fieldset>
            <label
              htmlFor='displayText'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Display Text
            </label>
            <textarea
              className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              id='displayText'
              cols={30}
              rows={5}
              {...form.displayText}
            ></textarea>
          </fieldset>
          <div className='grid grid-cols-2 gap-4'>
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
                  {...form.displayTextColor}
                />
                <input
                  type='text'
                  className='bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg border-l-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
                  value={watch('displayTextColor') || '#000000'}
                  onChange={(e) => {
                    console.log('e', e)
                    setValue('displayTextColor', e.target.value)
                  }}
                />
              </div>
            </fieldset>
            <Input
              label='Display Text Size'
              inputRef={form.displayTextFontSize.ref}
              {...form.displayTextFontSize}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <fieldset>
              <label
                htmlFor='displayText'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Text Animation
              </label>
              <Controller
                name='textAnimationType'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Listbox {...field}>
                    <div className='relative mt-1'>
                      <Listbox.Button className='relative bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                        <span className='block truncate text-start min-h-[20px]'>
                          {field.value ?? ''}
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
                          {textAnimateOption.map((animate) => {
                            return (
                              <div key={`animate-${animate}`}>
                                <div className='py-2 pl-4 pr-4 font-semibold'>
                                  {animate}
                                </div>
                                {animationList[animate]?.map((item) => {
                                  return (
                                    <Listbox.Option
                                      key={`animate-${animate}-${item}`}
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
                                              selected
                                                ? 'font-medium'
                                                : 'font-normal'
                                            }`}
                                          >
                                            {item}
                                          </span>
                                        </>
                                      )}
                                    </Listbox.Option>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                )}
              />
            </fieldset>
            <Input
              label='Duration'
              inputRef={form.textAnimationDuration.ref}
              {...form.textAnimationDuration}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              inputRef={form.textAnimationTime.ref}
              label='Animation Repeat'
              disabled={watch('textAnimationLoop')}
              {...form.textAnimationTime}
            />
            <fieldset>
              <label
                htmlFor='textAnimationTime'
                className='block mb-2 text-sm font-medium text-gray-900'
              >
                Animation Loop
              </label>
              <div className='flex items-center pl-4 border border-gray-200 rounded-lg '>
                <input
                  id='animationLoop'
                  type='checkbox'
                  {...form.textAnimationLoop}
                  className='w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 '
                />
                <label
                  htmlFor='animationLoop'
                  className='w-full py-2.5 ml-2 text-sm font-medium text-gray-900 '
                >
                  infinity
                </label>
              </div>
            </fieldset>
          </div>
          <button
            type='button'
            onClick={handleConvertToCanvas}
            className='text-white bg-[#93D600] hover:opacity-[0.9] focus:ring-4 focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 mt-[20px]'
          >
            Render Video
          </button>
        </div>
        <div className='p-[20px] min-w-[calc(100%-400px)] w-fit' ref={ref}>
          <div
            ref={drop}
            className={`relative border-[2px] overflow-hidden`}
            style={{
              width: `${watch('displayWidth')}px`,
              height: `${watch('displayHeight')}px`,
              aspectRatio: `${watch('displayWidth')}/${watch('displayHeight')}`,
            }}
          >
            <img
              className='absolute'
              ref={refImageBg}
              src={watch('displayBackground') || ''}
              alt=''
            />
            <DragBox top={boxes.top} left={boxes.left} hideSourceOnDrag={true}>
              <div
                className={`cursor-move w-fit animate__animated animate__${watch(
                  'textAnimationType'
                )}`}
                style={{
                  color: `${watch('displayTextColor') || '#000000'}`,
                  fontSize: `${watch('displayTextFontSize') || 16}px`,
                  animationDuration: `${watch('textAnimationDuration') || 1}s`,
                  animationIterationCount: watch('textAnimationLoop')
                    ? 'infinite'
                    : watch('textAnimationTime'),
                }}
              >
                {watch('displayText') || 'Display Text'}
              </div>
            </DragBox>
          </div>
        </div>
      </div>
      <div ref={refRender}></div>
      <LoadingPage />
    </div>
  )
}

export default App
