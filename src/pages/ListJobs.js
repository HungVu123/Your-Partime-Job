import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useCookies } from "react-cookie";
import clsx from "clsx";
import { Box } from "@mui/material";

export default function ListJobs() {
  const [Jobs, setJobs] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies();
  const CustomValueFormatter = ({ value }) => {
    // Define the condition for formatting based on your requirement
    const shouldFormat = value !== 1;

    // Perform formatting based on the condition
    if (shouldFormat) {
      return `Approved`;
    } else {
      return "Pending";
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        `https://exe201.duckdns.org/employers/${cookies.UserInfo.employerId}`
      );
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    { field: "jobId", headerName: "ID", width: 30 },
    { field: "title", headerName: "Job name", width: 250 },
    { field: "description", headerName: "Description", width: 950 },
    {
      field: "salaryRate",
      headerName: "Salary ($)",
      type: "number",
      width: 80,
    },
    {
      field: "workLocation",
      headerName: "Address",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 250,
    },
    {
      field: "jobStatus",
      type: "number",
      headerName: "Status",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
      valueFormatter: CustomValueFormatter,
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }

        return clsx("super-app", {
          pending: (params.value = 1),
          approved: (params.value = 2),
        });
      },
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
      <Box
        sx={{
          "& .super-app.pending": {
            color: "red",
            fontWeight: "600",
          },
          "& .super-app.approved": {
            color: "green",
            fontWeight: "600",
          },
        }}
      >
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
          getRowId={(row) => row.jobId + row.description}
        />
      </Box>
    </div>
  );
}
