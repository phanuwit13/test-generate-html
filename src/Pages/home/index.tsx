import { Listbox, Transition } from '@headlessui/react'
import { DragBox } from 'Components/DragBox'
import Input from 'Components/Input'
import { useLoadingPageStore } from 'Components/LoadingPage/store'
import Glitch from 'Components/TextAnimation/Glitch'
import GlitchSetting from 'Components/TextAnimation/Glitch/Components/Setting'
import Gracias from 'Components/TextAnimation/Gracias'
import GraciasSetting from 'Components/TextAnimation/Gracias/Components/Setting'
import Luminance from 'Components/TextAnimation/Luminance'
import LuminanceSetting from 'Components/TextAnimation/Luminance/Components/Setting'
import { htmlToVideo } from 'Services/htmlToVideo'
import { useGeneralStore } from 'Store/general'
import { animationList } from 'Utils/constants'
import { AxiosError } from 'axios'
import saveAs from 'file-saver'
import JSZip from 'jszip'
import { ChevronsUpDown, PlusIcon } from 'lucide-react'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { XYCoord } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

interface TextStyle {
  name: string
  component: () => JSX.Element
  setting: () => JSX.Element
}
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
  textStyle: TextStyle
}

function HomePage() {
  const ref = useRef<any>(null)
  const refImageBg = useRef<any>(null)
  const { setIsLoading } = useLoadingPageStore()
  const { setDisplayBackgroundFile, setBackgroundType } = useGeneralStore()

  // const [boxes, setBoxes] = useState<{
  //   top: number
  //   left: number
  // }>({
  //   top: 0,
  //   left: 0,
  // })
  const [boxes, setBoxes] = useState<{
    [key: string]: {
      top: number
      left: number
      title: string
    }
  }>({
    text1: { top: 0, left: 0, title: 'Drag me around' },
    text2: { top: 0, left: 0, title: 'Drag me too' },
  })

  // const moveBox = useCallback(
  //   (left: number, top: number) => {
  //     setBoxes({ left, top })
  //   },
  //   [setBoxes]
  // )

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      const current = { ...boxes }
      current[id] = {
        ...current[id],
        left,
        top,
      }
      console.log('current[id]', current[id], id)
      setBoxes(current)
    },
    [boxes, setBoxes]
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'box',
      drop(
        item: {
          top: number
          left: number
          id: string
        },
        monitor
      ) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox]
  )

  const handleRenderVideo = async (htmlFileData: Blob, cssFileData: Blob) => {
    setIsLoading(true)

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
    zip
      .generateAsync({ type: 'blob' })
      .then(async function (content) {
        await saveAs(content, 'content.zip')
        try {
          const res = await htmlToVideo.generateVideo({
            file: content,
            width: watch('displayWidth'),
            height: watch('displayHeight'),
          })
          console.log('res', res)
          setIsLoading(false)
          if (res.status === 200) {
            const blob = new Blob([res.data], { type: 'video/mp4' })
            await saveAs(blob, 'example.mp4')
            Swal.fire('', 'Download video successfully', 'success')
          } else {
            Swal.fire('', res.data.error, 'error')
          }
        } catch (error: any | AxiosError<any>) {
          setIsLoading(false)
          Swal.fire('', error.message, 'error')
        }
      })
      .catch((e) => {
        setIsLoading(false)
        Swal.fire('', e.message, 'error')
      })
  }

  const handleReadFileImage = (file: FileList | null) => {
    if (file?.length) {
      const imageUrl = URL.createObjectURL(file[0])
      setValue('displayBackground', imageUrl)
      setValue('displayBackgroundFile', file[0])
      setDisplayBackgroundFile(file[0])
    }
  }

  const textStyleList = [
    {
      name: 'gracias',
      component: () => <Gracias />,
      setting: () => (
        <GraciasSetting
          handleRenderVideo={handleRenderVideo}
          contentHtml={ref}
          imageBg={refImageBg}
        />
      ),
    },
    {
      name: 'glitch',
      component: () => <Glitch />,
      setting: () => (
        <GlitchSetting
          handleRenderVideo={handleRenderVideo}
          contentHtml={ref}
          imageBg={refImageBg}
        />
      ),
    },
    // {
    //   name: 'clip',
    //   component: () => <Clip />,
    //   setting: () => (
    //     <ClipSetting
    //       handleRenderVideo={handleRenderVideo}
    //       contentHtml={ref}
    //       imageBg={refImageBg}
    //     />
    //   ),
    // },
    {
      name: 'luminance',
      component: () => <Luminance />,
      setting: () => (
        <LuminanceSetting
          handleRenderVideo={handleRenderVideo}
          contentHtml={ref}
          imageBg={refImageBg}
        />
      ),
    },
  ]

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
      textStyle: textStyleList[0],
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
    textStyle: register('textStyle'),
  }

  const textAnimateOption = Object.keys(animationList)
  const backgroundType = watch('backgroundType')

  const handleAddText = () => {
    setBoxes({
      ...boxes,
      [`text${Object.keys(boxes).length + 1}`]: {
        left: 0,
        top: 0,
        title: '',
      },
    })
  }

  useEffect(() => {
    setBackgroundType(backgroundType)
  }, [setBackgroundType, backgroundType])

  return (
    <div className='flex overflow-x-auto min-h-screen'>
      <div className='p-[20px] min-w-[400px] w-[400px] gap-2 grid grid-cols-1 h-fit'>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            // ref={form.displayWidth.ref}
            label='Width'
            {...form.displayWidth}
          />
          <Input
            // inputRef={form.displayHeight.ref}
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
              // inputRef={form.displayBackground.ref}
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
                      <Listbox.Options className='z-[10] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
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
          <Input label='Duration' {...form.textAnimationDuration} />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            // inputRef={form.textAnimationTime.ref}
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
          <fieldset>
            <label
              htmlFor='displayText'
              className='block mb-2 text-sm font-medium text-gray-900'
            >
              Text Style
            </label>
            <Controller
              name='textStyle'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Listbox {...field}>
                  <div className='relative mt-1'>
                    <Listbox.Button className='relative bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>
                      <span className='block truncate text-start min-h-[20px]'>
                        {field.value?.name ?? ''}
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
                      <Listbox.Options className='z-[10] absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                        {textStyleList.map((textStyle) => {
                          return (
                            <Listbox.Option
                              key={`textStyle-${textStyle.name}`}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'text-gray-900'
                                }`
                              }
                              value={textStyle}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {textStyle.name}
                                  </span>
                                </>
                              )}
                            </Listbox.Option>
                          )
                        })}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              )}
            />
          </fieldset>
        </div>
        {Object.keys(boxes).map((item, index) => {
          return (
            <div key={item}>
              <Input
                name=''
                label={`Display Text ${index + 1}`}
                onChange={(e) => {
                  console.log('e')
                }}
              />
            </div>
          )
        })}
        <button
          onClick={handleAddText}
          className='border-dashed rounded-lg p-1.5 font-semibold border-2 flex items-center justify-center gap-2'
        >
          Add Text <PlusIcon size={16} />{' '}
        </button>
        <b className='py-2'>Text Style Animation</b>
        <hr />
        <div className='grid grid-cols-2 gap-4'>
          {watch('textStyle').setting()}
        </div>
      </div>
      <div className='p-[20px] min-w-[calc(100%-400px)] w-fit' ref={ref}>
        <div
          ref={drop}
          className={`relative border-[2px] overflow-hidden`}
          style={{
            width: `${watch('displayWidth')}px`,
            height: `${watch('displayHeight')}px`,
            aspectRatio: `${watch('displayWidth')}/${watch('displayHeight')}`,
            overflow: 'hidden',
          }}
        >
          <img
            className='absolute'
            ref={refImageBg}
            src={watch('displayBackground') || ''}
            alt=''
          />
          {Object.keys(boxes).map((key) => {
            const { left, top, title } = boxes[key] as {
              top: number
              left: number
              title: string
            }
            return (
              <DragBox
                id={key}
                key={key}
                top={top}
                left={left}
                hideSourceOnDrag={true}
              >
                <div
                  className={`cursor-move w-fit animate__animated animate__${watch(
                    'textAnimationType'
                  )}`}
                  style={{
                    width: '100%',
                    color: `${watch('displayTextColor') || '#000000'}`,
                    fontSize: `${watch('displayTextFontSize') || 16}px`,
                    animationDuration: `${
                      watch('textAnimationDuration') || 1
                    }s`,
                    animationIterationCount: watch('textAnimationLoop')
                      ? 'infinite'
                      : watch('textAnimationTime'),
                  }}
                >
                  {watch('textStyle').component()}
                  {/* {title} */}
                </div>
              </DragBox>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomePage
