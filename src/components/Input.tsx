import React from "react"
import FormMessage from 'components/fields/FormMessage';

interface IInputProps extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  error?: string
}

export const Input: React.FC<IInputProps> = ({value, onChange, label, error, ...props}) =>{
  return (
    <div className="space-y-1">
      <label
        htmlFor={label}
        className="block font-semibold uppercase"
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        id={label}
        name={label}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {error && <FormMessage type="error">{error}</FormMessage>}
    </div>
  )
}