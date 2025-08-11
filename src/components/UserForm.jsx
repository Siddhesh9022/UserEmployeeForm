  import React, { useState, useContext } from 'react'
  import { DataContext } from '../context/DataContext'
  import { toast } from 'react-toastify'
  import { useNavigate } from 'react-router-dom'
  import UserTable from './UserTable'
  import Spinner from './Spinner/Spinner'
  import { assets } from '../assets/assets'

  const phoneRegex = /^[6-9]\d{9}$/
  const pinRegex = /^\d{6}$/

  const initialFormState = {
    firstName: '',
    lastName: '',
    gender: 'male',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    pin: '',
    district: 'Pune',
    state: 'Maharashtra'
  }

  const UserForm = () => {
    const [collapsed, setCollapsed] = useState(false)
    const { users, setUsers, setPrefillName } = useContext(DataContext)
    const [form, setForm] = useState(initialFormState)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [goEmployeeLoading, setGoEmployeeLoading] = useState(false)
    const [showResetConfirm, setShowResetConfirm] = useState(false)
    const navigate = useNavigate()

    const [duplicatePhone, setDuplicatePhone] = useState(false)

    const isFormDirty = () => {
      return Object.keys(initialFormState).some(
        key => form[key] !== initialFormState[key]
      )
    }

    const validate = () => {
      const e = {}
      if (!form.firstName.trim()) e.firstName = 'First name is required'
      if (!form.lastName.trim()) e.lastName = 'Last name is required'
      if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required'
      if (!phoneRegex.test(form.phone)) e.phone = 'Invalid phone number'
      if (!pinRegex.test(form.pin)) e.pin = 'Invalid PIN code'
      setErrors(e)
      return Object.keys(e).length === 0
    }

    const handleChange = (field, value) => {
      setForm(prev => ({ ...prev, [field]: value }))

      if (field === 'phone') {
        const isDuplicate = users.some(
          (u, i) => u.phone === value && i !== editIndex
        )
        setDuplicatePhone(isDuplicate)
      }
    }

    const handleFocus = (field) => {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
      if (field === 'phone') {
        setDuplicatePhone(false)
      }
    }

    const handleSave = async e => {
      e.preventDefault()
      if (!validate()) return
      if (duplicatePhone) return
      setLoading(true)
      await new Promise(r => setTimeout(r, 500))

      const newUser = {
        name: `${form.firstName} ${form.lastName}`,
        gender: form.gender,
        phone: form.phone,
        address: {
          line1: form.addressLine1,
          line2: form.addressLine2,
          pin: form.pin,
          district: form.district,
          state: form.state
        }
      }

      if (editIndex === null) {
        setUsers(prev => [...prev, newUser])
        toast.success('User saved')
      } else {
        setUsers(prev => {
          const updated = [...prev]
          updated[editIndex] = newUser
          return updated
        })
        toast.success('User updated')
        setEditIndex(null)
      }

      setForm(initialFormState)
      setLoading(false)
      setDuplicatePhone(false)
    }

    const handleEdit = index => {
      const u = users[index]
      const [first, ...lastParts] = u.name.split(' ')
      setForm({
        firstName: first,
        lastName: lastParts.join(' '),
        gender: u.gender,
        phone: u.phone,
        addressLine1: u.address?.line1 || '',
        addressLine2: u.address?.line2 || '',
        pin: u.address?.pin || '',
        district: u.address?.district || 'Pune',
        state: u.address?.state || 'Maharashtra'
      })
      setEditIndex(index)
      setCollapsed(false)
      setDuplicatePhone(false)
    }

    const handleDelete = index => {
      setUsers(prev => prev.filter((_, i) => i !== index))
      toast.success('User deleted')
    }

    const goToEmployee = () => {
      setGoEmployeeLoading(true)
      setPrefillName(`${form.firstName} ${form.lastName}`.trim())
      setTimeout(() => {
        navigate('/employeeForm')
        setGoEmployeeLoading(false)
      }, 800)
    }

    const confirmReset = () => {
      setResetLoading(true)
      setTimeout(() => {
        setForm(initialFormState)
        setErrors({})
        setEditIndex(null)
        setResetLoading(false)
        setShowResetConfirm(false)
        setDuplicatePhone(false)
      }, 500)
    }

    const disableActionButtons =
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.addressLine1.trim() ||
      !form.pin.trim() ||
      duplicatePhone

    return (
      <div className="flex flex-col p-4 text-black text-sm gap-5">
        {/* Home button top-Left */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="fixed top-4 p-2 bg-black rounded-full shadow hover:bg-red-500 z-50"
        >
          <img src={assets.Home} alt="Home" className="w-6 h-6" />
        </button>

        <div className="bg-yellow-50 p-6 max-w-6xl w-full mx-auto border-2 border-yellow rounded-2xl shadow shadow-gray-900">
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-2xl font-bold font-ital">
              {editIndex === null ? 'Add New User' : 'Edit User'}
            </h2>
            <button
              type="button"
              onClick={() => setCollapsed(prev => !prev)}
              className='px-3 py-1 bg-red-600 hover:bg-red-800 rounded-xl transition-colors duration-200'
            >
              <img
                src={collapsed ? assets.Expand : assets.Collapse}
                alt={collapsed ? "Expand" : "Collapse"}
                className="w-5 h-5"
              />
            </button>
          </div>

          {!collapsed && (
            <>
              <hr className='mb-4' />
              <form onSubmit={handleSave}>
                {/* FORM FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15">
                  <div>
                    <label className='font-ital'>
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.firstName}
                      onChange={e => handleChange('firstName', e.target.value)}
                      onFocus={() => handleFocus('firstName')}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className='font-ital'>
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.lastName}
                      onChange={e => handleChange('lastName', e.target.value)}
                      onFocus={() => handleFocus('lastName')}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15'>
                  <div className="mt-3">
                    <label className='font-ital'>Gender</label>
                    <div className="flex gap-4 mt-1 font-ital">
                      {['male', 'female', 'other'].map(g => (
                        <label key={g} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={form.gender === g}
                            onChange={() => handleChange('gender', g)}
                          />
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className='font-ital'>
                      Phone<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      onFocus={() => handleFocus('phone')}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    {duplicatePhone && (
                      <p className="text-red-500 text-sm">Phone number already exists</p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15'>
                  <div className="mt-3">
                    <label className='font-ital'>Address Line 1 <span className="text-red-500">*</span></label>
                    <input
                      value={form.addressLine1}
                      onChange={e => handleChange('addressLine1', e.target.value)}
                      onFocus={() => handleFocus('addressLine1')}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mt-3">
                    <label className='font-ital'>Address Line 2</label>
                    <input
                      value={form.addressLine2}
                      onChange={e => handleChange('addressLine2', e.target.value)}
                      onFocus={() => handleFocus('addressLine2')}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className='font-ital'>
                      Pin<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.pin}
                      onChange={e => handleChange('pin', e.target.value)}
                      onFocus={() => handleFocus('pin')}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                    {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}
                  </div>
                  <div>
                    <label className='font-ital'>District</label>
                    <select
                      value={form.district}
                      onChange={e => handleChange('district', e.target.value)}
                      className="mt-1 w-full border font-ital text-black rounded px-3 py-2"
                    >
                      <option>Pune</option>
                      <option>Mumbai</option>
                      <option>Nashik</option>
                      <option>Nagpur</option>
                      <option>Solapur</option>
                    </select>
                  </div>
                  <div>
                    <label>State</label>
                    <select
                      value={form.state}
                      onChange={e => handleChange('state', e.target.value)}
                      className="mt-1 w-full border font-ital text-black rounded px-3 py-2"
                    >
                      <option>Maharashtra</option>
                      <option>Gujarat</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Delhi</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      disabled={!isFormDirty() || resetLoading}
                      className={`px-4 py-2 bg-gray-400 font-ital flex flex-row items-center justify-center text-black rounded ${!isFormDirty() || resetLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"}`}
                    >
                      {resetLoading ? <Spinner /> : "Reset"}
                    </button>
                    {showResetConfirm && (
                      <span className="text-sm text-black flex items-center gap-2">
                        Do you want to reset the form?
                        <button
                          onClick={confirmReset}
                          className="px-2 py-1 bg-green-800 text-white rounded hover:bg-red-700"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-2 py-1 bg-green-800 text-white rounded hover:bg-red-700"
                        >
                          No
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading || disableActionButtons}
                      className={`px-4 py-2 font-ital flex items-center justify-center gap-2 rounded text-white ${loading || disableActionButtons
                        ? "bg-green-800 opacity-50 cursor-not-allowed"
                        : "bg-green-800 hover:bg-green-700"
                        }`}
                    >
                      {loading ? <Spinner /> : editIndex === null ? 'Save' : 'Update'}
                    </button>

                    <button
                      type="button"
                      onClick={goToEmployee}
                      disabled={goEmployeeLoading || disableActionButtons}
                      className={`px-4 py-2 font-ital flex items-center justify-center gap-2 rounded text-white ${goEmployeeLoading || disableActionButtons
                        ? "bg-red-900 opacity-50 cursor-not-allowed"
                        : "bg-red-900 hover:bg-red-700"
                        }`}
                    >
                      {goEmployeeLoading ? <Spinner /> : "Go to Employee Form"}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        <div className="bg-yellow-50 p-6 max-w-6xl w-full mx-auto border-2 border-yellow rounded-2xl shadow-2xl shadow-gray-900">
          <UserTable onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    )
  }

  export default UserForm
