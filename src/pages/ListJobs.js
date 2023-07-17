import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function ListJobs() {
  const [Jobs, setJobs] = useState([]);
  const getUser = async () => {
    try {
      const response = await axios.get(
        "https://647e3d68af984710854b1627.mockapi.io/jobs",
        {
          params: {
            status: 2, // Filter by status value of 1
          },
        }
      );
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Job name", width: 250 },
    { field: "description", headerName: "Description", width: 950 },
    { field: "price", headerName: "Salary ($)", type: "number", width: 80 },
    {
      field: "address",
      headerName: "Address",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
    },
  ];
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <button
        className="btnback"
        style={{ backgroundColor: "white", marginTop: "20px" }}
      >
        <h4>
          <Link to="/employMain" style={{ textDecoration: "none" }}>
            <i class="fas fa-solid fa-arrow-left"></i> Back to employ screen
          </Link>
        </h4>
      </button>
      <h1>List of jobs</h1>
      <DataGrid
        rows={Jobs}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}
