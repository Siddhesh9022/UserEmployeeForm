import React, { useState, useContext, useEffect } from 'react'
import { DataContext } from '../context/DataContext'
import { useNavigate } from 'react-router-dom'
import EmployeeTable from './EmployeeTable'
import Spinner from './Spinner/Spinner'
import { assets } from '../assets/assets'

const EmployeeForm = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { employees, setEmployees, prefillName, setPrefillName } = useContext(DataContext)
  const [form, setForm] = useState({
    name: '',
    department: 'Engineering',
    code: '',
    profile: 'Full-time'
  })
  const [loading, setLoading] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [collapseLoading, setCollapseLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const [isDuplicateCode, setIsDuplicateCode] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [codeError, setCodeError] = useState(false)

  useEffect(() => {
    if (prefillName) {
      setForm(prev => ({ ...prev, name: prefillName }))
      setPrefillName('')
    }
  }, [prefillName, setPrefillName])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))

    if (field === 'name') {
      setNameError(false)
    }

    if (field === 'code') {
      setCodeError(false)
      const duplicate = employees.some((emp, idx) =>
        emp.code.trim().toLowerCase() === value.trim().toLowerCase() &&
        idx !== editIndex
      )
      setIsDuplicateCode(duplicate)
    }
  }

  const handleFocus = (field) => {
    if (field === 'name') setNameError(false)
    if (field === 'code') {
      setCodeError(false)
      setIsDuplicateCode(false)
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    let valid = true

    if (!form.name.trim()) {
      setNameError(true)
      valid = false
    }
    if (!form.code.trim()) {
      setCodeError(true)
      valid = false
    }
    if (isDuplicateCode) {
      valid = false
    }

    if (!valid) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 500))

    const newEmployee = {
      name: form.name.trim(),
      department: form.department,
      code: form.code,
      profile: form.profile
    }

    if (editIndex === null) {
      setEmployees(prev => [...prev, newEmployee])
    } else {
      setEmployees(prev => {
        const updated = [...prev]
        updated[editIndex] = newEmployee
        return updated
      })
      setEditIndex(null)
    }

    setForm({ name: '', department: 'Engineering', code: '', profile: 'Full-time' })
    setIsDuplicateCode(false)
    setLoading(false)
  }

  const handleEdit = index => {
    const emp = employees[index]
    setForm({
      name: emp.name,
      department: emp.department,
      code: emp.code,
      profile: emp.profile
    })
    setEditIndex(index)
    setIsDuplicateCode(false)
    setCollapsed(false)
  }

  const handleDelete = index => {
    setEmployees(prev => prev.filter((_, i) => i !== index))
  }

  const handleCollapseToggle = () => {
    setCollapseLoading(true)
    setCollapsed(prev => !prev)
    setCollapseLoading(false)
  }

  const handleReset = () => {
    setResetLoading(true)
    setTimeout(() => {
      setForm({ name: '', department: 'Engineering', code: '', profile: 'Full-time' })
      setEditIndex(null)
      setIsDuplicateCode(false)
      setNameError(false)
      setCodeError(false)
      setResetLoading(false)
    }, 400)
  }

  // ✅ Disable reset until at least one field has value
  const isFormDirty = form.name.trim() || form.code.trim() || form.department !== 'Engineering' || form.profile !== 'Full-time'

  return (
    <div className="flex flex-col p-4 text-black text-sm gap-5 relative">
      
      {/* Home Button fixed at top-left */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="fixed top-4  p-2 bg-black rounded-full shadow hover:bg-red-500 z-50"
      >
        <img src={assets.Home} alt="Home" className="w-6 h-6" />
      </button>

      <div className="bg-yellow-50 p-6 max-w-6xl w-full mx-auto border-2 border-black rounded-2xl shadow shadow-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-ital">
            {editIndex === null ? 'Add Employee' : 'Edit Employee'}
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCollapseToggle}
              className="px-3 py-1 bg-red-600 hover:bg-red-800 text-white rounded-xl transition-colors duration-200 "
              disabled={collapseLoading}
            >
              <img
                src={collapsed ? assets.Expand : assets.Collapse}
                alt={collapsed ? "Expand" : "Collapse"}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {!collapsed && (
          <>
            <hr className='mb-4' />
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-15">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Name <span className="text-red-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onFocus={() => handleFocus('name')}
                    className={`w-full border rounded px-3 py-2 ${nameError ? 'border-red-500' : 'border-gray-600'}`}
                  />
                  {nameError && <span className="text-xs text-red-600 mt-1">Name is required</span>}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Employee Code <span className="text-red-500">*</span></label>
                  <input
                    value={form.code}
                    onChange={e => handleChange('code', e.target.value)}
                    onFocus={() => handleFocus('code')}
                    className={`w-full border rounded px-3 py-2 ${
                      codeError || isDuplicateCode ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {codeError && <span className="text-xs text-red-600 mt-1">Code is required</span>}
                  {isDuplicateCode && !codeError && (
                    <span className="text-xs text-red-600 mt-1">
                      Employee code already exists!
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-15">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Department</label>
                  <select
                    value={form.department}
                    onChange={e => handleChange('department', e.target.value)}
                    className="w-full border border-gray-600 rounded px-3 py-2 "
                  >
                    <option>Engineering</option>
                    <option>HR</option>
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-medium">Profile</label>
                  <select
                    value={form.profile}
                    onChange={e => handleChange('profile', e.target.value)}
                    className="w-full border border-gray-600 rounded px-3 py-2 "
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Intern</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!isFormDirty || resetLoading}
                  className={`px-4 py-2 rounded transition-colors duration-200 flex items-center gap-2 ${
                    !isFormDirty
                      ? 'bg-gray-300 text-red-500 cursor-not-allowed'
                      : 'bg-gray-400 hover:bg-gray-500 text-white'
                  }`}
                >
                  {resetLoading ? <Spinner /> : 'Reset'}
                </button>

                <button
                  type="submit"
                  disabled={loading || isDuplicateCode}
                  className={`px-4 py-2 rounded transition-colors duration-200 flex items-center gap-2 ${
                    loading || isDuplicateCode
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? <Spinner /> : editIndex === null ? 'Save' : 'Update'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <div className="bg-yellow-50 p-6 max-w-6xl w-full mx-auto border-2 border-black rounded-2xl shadow shadow-black">
        <EmployeeTable onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default EmployeeForm
