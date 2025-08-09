import React from 'react'
import PrimaryButton from './PrimaryButton'




const buttonList = [
  { label: 'User Form', path: '/userForm', color: 'bg-yellow-50 hover:bg-red-500' },
  { label: 'Employee Form', path: '/employeeForm', color: ' bg-yellow-50 hover:bg-red-500' }
 

]

const Home = () => {
  return (
   <div className='flex flex-col items-center justify-center text-black border-2 text-2xl min-h-screen pb-2 gap-10'>

  <div className='rounded-2xl bg-amber-950 p-10 m-10 flex flex-col border-2 border-black shadow-2xl shadow-gray-900 justify-center gap-5'>
    <h1 className='text-4xl md:text-6xl text-center text-white font-bold '>
      Welcome to the UserEmployee
    </h1>

    <div className='flex flex-col md:flex-row justify-center gap-4'>
      {buttonList.map((btn) => (
        <PrimaryButton
          key={btn.path}
          to={btn.path}
          color={btn.color}
         
         
        >
          {btn.label}
        </PrimaryButton>
      ))}
    </div>
  </div>

</div>
  )
}

export default Home