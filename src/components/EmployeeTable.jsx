import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { assets } from '../assets/assets';

const EmployeeTable = ({ onEdit, onDelete }) => {
  const { employees } = useContext(DataContext);

  const [sortOrder, setSortOrder] = useState('default'); // sorting state
  const [deleteIndex, setDeleteIndex] = useState(null); // track which employee to delete

  // Find duplicate IDs
  const idCount = employees.reduce((acc, emp) => {
    acc[emp.id] = (acc[emp.id] || 0) + 1;
    return acc;
  }, {});
  const duplicateIds = new Set(Object.keys(idCount).filter(id => idCount[id] > 1));

  // Add originalIndex to restore default order
  const employeesWithIndex = employees.map((emp, index) => ({
    ...emp,
    originalIndex: index
  }));

  // Sorting logic
  let displayedEmployees = [...employeesWithIndex];
  if (sortOrder === 'asc') {
    displayedEmployees.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'default') {
    displayedEmployees.sort((a, b) => a.originalIndex - b.originalIndex);
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'default' ? 'asc' : 'default'));
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index); // show confirmation for this index
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onDelete(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
  };

  return (
    <div className="bg-yellow-50 text-black w-full p-1 m-1">
      <h3 className="text-lg font-semibold mb-3">Employees</h3>
      {employees.length === 0 ? (
        <p className="text-sm text-gray-500">No employees added yet.</p>
      ) : (
        <table className="w-full border-collapse border-2 table-auto text-sm">
          <thead>
            <tr className="border-b">
              <th className="border-2">ID</th>
              <th className="border-2">
                <div className="flex items-center justify-center gap-1">
                  Name
                  <button
                    onClick={toggleSortOrder}
                    className="text-xs bg-blue-200 px-1 rounded"
                    title="Toggle sort"
                  >
                    {sortOrder === 'default' ? 'A→Z' : '↩'}
                  </button>
                </div>
              </th>
              <th className="border-2">Department</th>
              <th className="border-2">Code</th>
              <th className="border-2">Profile</th>
              <th className="border-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((emp, i) => (
              <tr key={emp.originalIndex} className="border-b">
                <td className="border-2 p-1 text-center align-middle">
                  {i + 1}
                  {duplicateIds.has(emp.id) && (
                    <span className="ml-1 text-red-500 text-xs">⚠ duplicate</span>
                  )}
                </td>
                <td className="border-2 p-1 text-center align-middle">{emp.name}</td>
                <td className="border-2 p-1 text-center align-middle">{emp.department}</td>
                <td className="border-2 p-1 text-center align-middle">{emp.code}</td>
                <td className="border-2 p-1 text-center align-middle">{emp.profile}</td>
                <td className="space-x-2 text-center gap-0.5 align-middle">
                  {deleteIndex === emp.originalIndex ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-red-600">Delete this employee?</span>
                      <div className="flex gap-1">
                        <button
                          onClick={confirmDelete}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="bg-gray-300 px-2 py-1 rounded text-xs"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(emp.originalIndex)}
                        className="bg-green-500 rounded align-center justify-center mt-1 mb-1"
                      >
                        <img src={assets.Edit} alt="Edit" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(emp.originalIndex)}
                        className="bg-red-500 text-white rounded justify-center mt-1 mb-1"
                      >
                        <img src={assets.Delete} alt="Delete" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeTable;
