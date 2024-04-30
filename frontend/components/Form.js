import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'

// 👇 Here are the validation errors, used with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here is the schema.
const schema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
  size: yup
    .string()
    .matches(/^[SML]$/, validationErrors.sizeIncorrect)
    .required(),
  toppings: yup
    .array()
    .of(yup.string()).required('Toppings are required'),
})

// 👇 This array helped to construct checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialValues = {
  fullName: '',
  size: '',
  toppings: []
}

export default function Form() {
  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState({ fullName: '', size: '' })
  const [enabled, setEnabled] = useState(false)
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()

  useEffect(() => {
    schema.isValid(formValues).then((valid) => setEnabled(valid))
  }, [formValues])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const newValue = type === 'checkbox'
      ? (checked
        ? [...formValues[name], value]
        : formValues[name].filter((item) => item !== value)) : value;
    setFormValues({ ...formValues, [name]: newValue })

    schema.validateAt(name, { [name]: newValue })
      .then(() => setErrors({ ...errors, [name]: '' }))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!enabled) return

    axios.post('http://localhost:9009/api/order', formValues)
      .then(res => {
        setFormValues(initialValues)
        setSuccess(res.data.message)
        setFailure()
      })
      .catch(err => {
        setFailure(err.response.data.message)
        setSuccess()
      })
  }


  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formValues.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={formValues.size}
            onChange={handleChange}
          >
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Generated the checkboxes dynamically */}
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.topping_id}
              checked={formValues.toppings.includes(topping.topping_id)}
              onChange={handleChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      {/* 👇 Submit stays disabled until the form validates! */}
      <input type="submit" disabled={!enabled} />
    </form>
  )
}
