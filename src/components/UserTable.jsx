import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import { assets } from '../assets/assets';

const UserTable = ({ onEdit, onDelete }) => {
  const { users } = useContext(DataContext);

  const [deleteIndex, setDeleteIndex] = useState(null); // For delete confirmation
  const [sortOrder, setSortOrder] = useState('default'); // "default" or "asc"

  // Store original index for restoring default order
  const usersWithIndex = users.map((user, index) => ({ ...user, originalIndex: index }));

  // Sorting logic
  let displayedUsers = [...usersWithIndex];
  if (sortOrder === 'asc') {
    displayedUsers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'default') {
    displayedUsers.sort((a, b) => a.originalIndex - b.originalIndex);
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'default' ? 'asc' : 'default'));
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      onDelete(deleteIndex);
      setDeleteIndex(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteIndex(null);
  };

  return (
    <div className="bg-yellow-50 text-black font-Nunito w-full p-2 m-2">
      <h3 className="text-lg font-semibold mb-3">Users Table</h3>
      {users.length === 0 ? (
        <p className="text-sm text-gray-500">No users added yet.</p>
      ) : (
        <table className="w-full border-collapse table-auto text-sm">
          <thead>
  <tr className="border-b">
    <th className="border-2">Id</th>
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
    <th className="border-2">Gender</th>
    <th className="border-2">Phone</th>
    <th className="border-2">Address</th>
    <th className="border-2">Actions</th>
  </tr>
</thead>
          <tbody>
            {displayedUsers.map((u, i) => (
              <tr key={u.originalIndex} className="border-2">
                <td className="border-2 p-1 text-center align-middle">{i + 1}</td>
                <td className="border-2 p-1 text-center align-middle">{u.name}</td>
                <td className="border-2 p-1 text-center align-middle">{u.gender}</td>
                <td className="border-2 p-1 text-center align-middle">{u.phone}</td>
                <td className="border-2 p-1 text-center align-middle">
                  {u.address.pin}, {u.address.district}
                </td>
                <td className="space-x-2 gap-0.5 text-center align-middle">
                  {deleteIndex === u.originalIndex ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-red-600">
                        Delete this user?
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={handleConfirmDelete}
                          className="bg-red-500 px-2 py-1 rounded text-white text-xs"
                        >
                          Yes
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="bg-gray-400 px-2 py-1 rounded text-black text-xs"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(u.originalIndex)}
                        className="bg-green-500 rounded align-center justify-center mt-1 mb-1"
                      >
                        <img src={assets.Edit} alt="Edit" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(u.originalIndex)}
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

export default UserTable;
