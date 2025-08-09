import React, { createContext, useState } from 'react'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [employees, setEmployees] = useState([])
  const [prefillName, setPrefillName] = useState('')

  return (
    <DataContext.Provider value={{
      users, setUsers,
      employees, setEmployees,
      prefillName, setPrefillName
    }}>
      {children}
    </DataContext.Provider>
  )
}
