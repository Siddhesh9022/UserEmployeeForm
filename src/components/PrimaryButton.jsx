import React from 'react'
import { Link } from 'react-router-dom'

const PrimaryButton = ({ to, children, color }) => {
  return (
     <Link to={to}>
      <button
        className={`px-6 py-3 rounded-lg text-lg font-bold transition-colors duration-200 w-48 ${color}`}>
        {children}
      </button>
    </Link>
  )
}

export default PrimaryButton