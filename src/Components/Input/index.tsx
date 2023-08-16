import React, { LegacyRef } from 'react'

interface TextInputProps {
  name: string
  onChange: (...event: any[]) => void
  onBlur?: (...event: any[]) => void
  value?: string
  label?: string
  disabled?: boolean
}

const Input = React.forwardRef(
  (
    { name, label, onChange, onBlur, disabled, value }: TextInputProps,
    ref: LegacyRef<HTMLInputElement>
  ) => (
    <fieldset>
      {label && (
        <label
          htmlFor={name}
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
        >
          {label}
        </label>
      )}
      <input
        id={name}
        className='disabled:bg-gray-100 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
        value={value}
      />
    </fieldset>
  )
)

export default Input
