import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

function EmployMain() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [UserList, setUserList] = useState([]);
  const [UserImage, setUserImage] = useState();
  const [UserListLength, setUserListLength] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  let navigate = useNavigate();

  const Logout = () => {
    removeCookie("UserInfo");
    navigate("/");
  };

  const addJob = () => {
    navigate("/postJob");
  };

  const listJobs = () => {
    navigate("/listJobs");
  };

  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(UserListLength)
        .fill(0)
        .map((i) => React.createRef()),
    [UserListLength]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < UserListLength - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir) => {
    await getUserImg();
    if (canSwipe && currentIndex < UserListLength) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const getUser = async () => {
    try {
      const response = await axios.get("https://13.229.181.7/api/student");
      setUserList(response.data);
      setUserListLength(response.data.length);
      setCurrentIndex(response.data.length - 1);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserImg = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api/");
      setUserImage(response.data.results[0].picture.large);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getUserImg();
  }, []);

  return (
    <div className="container">
      <div className="side">
        <div className="header">
          <div className="avatar">
            <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="" />
          </div>
          <div className="title">
            {cookies.UserInfo.employerName}
            <button onClick={Logout} style={{ marginLeft: "20px" }}>
              <span className="button_top"> Log Out</span>
            </button>
          </div>
        </div>
        <div className="menu">
          <ul>
            <li className="button" onClick={addJob}>
              Add Job
            </li>
            <li className="button" onClick={listJobs}>
              List Jobs
            </li>
            <li className="active">Message</li>
          </ul>
        </div>
        <div className="messages">
          <div className="avatar">
            <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="" />
          </div>
          <div className="message">
            <div className="user">Quinli</div>
            <div className="text">Hello, How are you?</div>
          </div>
        </div>
      </div>
      <div className="content">
        {UserList.map((job, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={job.studentId}
            onSwipe={(dir) => swiped(dir, job.studentId, index)}
            onCardLeftScreen={() => outOfFrame(job.studentId, index)}
          >
            <div className="card">
              <div className="img">
                <img
                  src={UserImage}
                  alt=""
                  style={{
                    borderRadius: "15px",
                    width: "4.8em",
                    height: "4.8em",
                  }}
                />
              </div>
              <div className="card__title">
                {job.lastName} {job.firstName}
              </div>
              <div className="card__subtitle">{job.description}</div>
              <div className="card__progress">
                <progress max="100" value="40"></progress>
              </div>
              <h4 style={{ color: "red" }}>Contact Information</h4>
              <div className="card__subtitle">
                Address: {job.studentAddress}
              </div>
              <div className="card__subtitle">Phone: {job.phone}</div>
              <div className="card__subtitle">Email: {job.email}</div>
            </div>
          </TinderCard>
        ))}
        <div
          className="buttons"
          style={{ position: "absolute", bottom: "0%", marginBottom: "50px" }}
        >
          <div className="no" onClick={() => swipe("left")}>
            <i className="fas fa-times"></i>
          </div>
          {/* <div className="star" onClick={() => goBack()}>
            <i className="fa fa-undo fa"></i>
          </div> */}
          <div className="heart" onClick={() => swipe("right")}>
            <i className="fas fa-heart"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployMain;
