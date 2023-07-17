import React, { useState } from "react";
import { AdminInfo } from "./data";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

export default function Admin() {
  let navigate = useNavigate();
  const [Jobs, setJobs] = useState([]);
  const [id, setId] = useState();
  const [status, setStatus] = useState();
  const Logout = () => {
    navigate("/");
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
  const handleOpen = (id, status) => {
    setOpen(true);
    setId(id);
    setStatus(status);
  };
  const handleClose = () => setOpen(false);

  const getJobs = async () => {
    try {
      const response = await axios.get(
        "https://647e3d68af984710854b1627.mockapi.io/jobs"
      );
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const deleteJob = async (id) => {
    try {
      await axios.delete(
        `https://647e3d68af984710854b1627.mockapi.io/jobs/${id}`
      );
      getJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const updateJob = async (id, status) => {
    try {
      await axios.put(
        `https://647e3d68af984710854b1627.mockapi.io/jobs/${id}`,
        { status }
      );
      getJobs();
      setOpen(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div class="container">
      <div class="side" style={{ height: "100%" }}>
        <div class="header">
          <div class="avatar">
            <img src={AdminInfo.profileUrl} alt="" />
          </div>
          <div class="title">
            {AdminInfo.name}
            <button onClick={Logout} style={{ marginLeft: "20px" }}>
              <span class="button_top"> Log Out</span>
            </button>
          </div>
        </div>
        <div class="menu">
          <ul>
            <li class="active">Message</li>
          </ul>
        </div>
        <div class="messages">
          <div class="avatar">
            <img
              src="https://randomuser.me/api/portraits/women/42.jpg"
              alt=""
            />
          </div>
          <div class="message">
            <div class="user">Quinli</div>
            <div class="text">Hello, How are you?</div>
          </div>
        </div>
      </div>
      <div class="content" style={{ padding: "0" }}>
        <h2>List of Jobs</h2>

        <table style={{ width: "100%" }}>
          <tr>
            <th></th>
            <th></th>
            <th>Name</th>
            <th>Description</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {Jobs.map((book, index) => (
            <tr key={book.id}>
              <td style={{ width: "1px" }}>{index + 1}</td>
              <td>
                <img
                  src={book.jobPhotoUrl}
                  alt=""
                  height="100px"
                  width="100px"
                />
              </td>
              <td>
                <h3>{book.name}</h3>
              </td>
              <td>
                <p>{book.description}</p>
              </td>
              <td>
                <span>{book.price}$</span>
              </td>
              <td>
                {book.status % 2 === 0 ? (
                  <div style={{ color: "red" }}>Pending</div>
                ) : (
                  <div style={{ color: "green" }}>Success</div>
                )}
              </td>
              <td>
                <button className="delete" onClick={() => deleteJob(book.id)}>
                  Delete
                </button>
                <button
                  className="update"
                  onClick={() => handleOpen(book.id, book.status)}
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
                onClick={() => updateJob(id, status % 2 === 0 ? 1 : 2)}
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
    </div>
  );
}
