import React, { useState, useEffect } from "react";
import axios from "axios";

const AllUsers = () => {
  const [alluser, setalluser] = useState([]);
  const getusers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8000/api/getusers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     localStorage.setItem("users", response.data.length)
    setalluser(response.data);
  };

  useEffect(() => {
    getusers();
  }, []);

  return (
    <div>
      <div>
        <h1 className="font-bold text-3xl text-fuchsia-700 underline">
          All Users
        </h1>
      </div>
      <div className="mt-12 overflow-x-auto  rounded shadow max-h-[450px]">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="text-white bg-fuchsia-600 h-12 sticky top-0 z-10">
            <tr className="">
              <th className="border resize-x overflow-auto border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                S.No
              </th>
              <th className="border resize-x overflow-auto border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                Name
              </th>
              <th className="border resize-x overflow-auto border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                Email
              </th>

              <th className="border resize-x overflow-auto border-gray-300 px-4 py-2 text-left whitespace-nowrap">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {alluser.map((item, index) => (
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                  {item.firstname} {item.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
