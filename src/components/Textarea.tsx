import React from "react"
import FormMessage from 'components/fields/FormMessage';

interface ITextareaProps extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
  error?: string
}

export const Textarea: React.FC<ITextareaProps> = ({value, onChange, label, error, ...props}) =>{
  return (
    <div className="space-y-1">
      <label
        htmlFor={label}
        className="block font-semibold uppercase"
      >
        {label}
      </label>
      <textarea
        id={label}
        name={label}
        value={value}
        // onChange={(event) => onChange(event.target.value)}
        className="w-full border min-h-16 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      {error && <FormMessage type="error">{error}</FormMessage>}
    </div>
  )
}