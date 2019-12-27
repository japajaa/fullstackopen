import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onSubmit = () => {
    setValue('')
    return null
  }


  const reset = () => {
    setValue('')
    return null
  }

  return {
    type,
    value,
    onChange,
    onSubmit
  }
}