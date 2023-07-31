import React, { useState } from "react";
import { AdminInfo } from "./data";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

export default function Admin() {
  let navigate = useNavigate();
  const [Jobs, setJobs] = useState([]);
  const [Job, setJob] = useState([]);
  const [id, setId] = useState();
  const [Emp, setEmp] = useState([]);
  const Logout = () => {
    navigate("/");
  };

  const getEmployeeInfo = (employerId) => {
    const employee = Emp.find((employee) => employee.employerId === employerId);
    return employee ? employee : null; // Return null if employerId is not found in the employees list
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const handleOpen = (id) => {
    setOpen(true);
    setId(id);
    getJob(id);
  };
  const handleOpen1 = (id) => {
    setOpen1(true);
    setId(id);
  };

  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);

  const getJobs = async () => {
    try {
      const response = await axios.get("http://13.229.181.7/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmp = async () => {
    try {
      const response = await axios.get("http://13.229.181.7/api/employers");
      setEmp(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getJob = async (id) => {
    try {
      const response = await axios.get(`http://13.229.181.7/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobs();
    getEmp();
  }, []);

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://13.229.181.7/api/jobs?id=${id}`);
      getJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const dateUpdated = new Date();

  const JobUpdate = {
    jobId: id,
    title: Job.title,
    description: Job.description,
    dateCreated: Job.dateCreated,
    dateUpdated: dateUpdated,
    workLocation: Job.workLocation,
    workType: Job.workType,
    salaryRate: Job.salaryRate,
    salaryType: Job.salaryType,
    jobStatus: Job.jobStatus === 1 ? 2 : 1,
    employerId: Job.employerId,
    categoryId: Job.categoryId,
  };

  const updateJob = async () => {
    try {
      await axios.put(`http://13.229.181.7/api/jobs`, JobUpdate);
      getJobs();
      setOpen(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="container">
      <div className="side" style={{ height: "100%" }}>
        <div className="header">
          <div className="avatar">
            <img src={AdminInfo.profileUrl} alt="" />
          </div>
          <div className="title">
            {AdminInfo.name}
            <button onClick={Logout} style={{ marginLeft: "20px" }}>
              <span className="button_top"> Log Out</span>
            </button>
          </div>
        </div>
        <div className="menu">
          <ul>
            <li className="active">Message</li>
          </ul>
        </div>
        <div className="messages">
          <div className="avatar">
            <img
              src="https://randomuser.me/api/portraits/women/42.jpg"
              alt=""
            />
          </div>
          <div className="message">
            <div className="user">Quinli</div>
            <div className="text">Hello, How are you?</div>
          </div>
        </div>
      </div>
      <div className="content" style={{ padding: "0" }}>
        <h2>List of Jobs</h2>

        <table style={{ width: "100%" }}>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Description</th>
            <th>WorkLocation</th>
            <th>WorkType</th>
            <th>Salary</th>
            <th>Emp</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {Jobs.map((job, index) => (
            <tr key={index}>
              <td style={{ width: "1px" }}>{index + 1}</td>
              <td>
                <h3>{job.title}</h3>
              </td>
              <td>
                <p>{job.description}</p>
              </td>
              <td>
                <p>{job.workLocation}</p>
              </td>
              <td>
                <p>{job.workType}</p>
              </td>
              <td>
                <span>
                  {job.salaryRate}/{job.salaryType}
                </span>
              </td>
              <td>
                <p>{getEmployeeInfo(job.employerId)?.employerName}</p>
              </td>
              <td>
                {job.jobStatus === 1 ? (
                  <div style={{ color: "red" }}>Pending</div>
                ) : (
                  <div style={{ color: "green" }}>Success</div>
                )}
              </td>
              <td>
                <button
                  className="delete"
                  onClick={() => handleOpen1(job.jobId)}
                >
                  Delete
                </button>
                <button
                  className="update"
                  onClick={() => handleOpen(job.jobId)}
                >
                  Update
                </button>
                {/* <Link to={"/postJob"} style={{ textDecoration: "none" }}>
                    Update
                  </Link> */}
              </td>
            </tr>
          ))}
        </table>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to update status of this job ?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => updateJob()}
              >
                Yes
              </Button>
              <Button variant="contained" color="error" onClick={handleClose}>
                No
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={open1}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete of this job ?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => deleteJob(id)}
              >
                Yes
              </Button>
              <Button variant="contained" color="error" onClick={handleClose1}>
                No
              </Button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
