import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

function Main() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [Jobs, setJobs] = useState([]);
  const [Emp, setEmp] = useState([]);
  const [UserListLength, setUserListLength] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  let navigate = useNavigate();
  const filteredJobs = Jobs.filter((job) => job.jobStatus !== 1);

  const getEmp = async () => {
    try {
      const response = await axios.get(
        "https://exe201.duckdns.org/api/employers"
      );
      setEmp(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployeeInfo = (employerId) => {
    const employee = Emp.find((employee) => employee.employerId === employerId);
    return employee ? employee : null; // Return null if employerId is not found in the employees list
  };

  const getUser = async () => {
    try {
      const response = await axios.get("https://exe201.duckdns.org/api/jobs");
      setJobs(response.data);
      setUserListLength(response.data.length);
      setCurrentIndex(response.data.length - 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getEmp();
  }, []);

  const Logout = () => {
    removeCookie("UserInfo");
    navigate("/");
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

  return (
    <div className="container">
      <div className="side">
        <div className="header">
          <div className="avatar">
            <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="" />
          </div>
          <div className="title">
            {cookies.UserInfo.firstName} {cookies.UserInfo.lastName}
            <button onClick={Logout} style={{ marginLeft: "20px" }}>
              <span className="button_top"> Log Out</span>
            </button>
          </div>
        </div>
        <div className="menu">
          <ul>
            <li>Matches</li>
            <li className="active">Message</li>
          </ul>
        </div>
        <div className="messages">
          <div className="avatar">
            <img
              src="https://randomuser.me/api/portraits/women/38.jpg"
              alt=""
            />
          </div>
          <div className="message">
            <div className="user">Caroline</div>
            <div className="text">Hello how can i help you</div>
          </div>
        </div>
      </div>
      <div className="content">
        {filteredJobs.map((job, index) => (
          <>
            <TinderCard
              ref={childRefs[index]}
              classNameName="swipe"
              key={index}
              onSwipe={(dir) => swiped(dir, job.id, index)}
              onCardLeftScreen={() => outOfFrame(job.id, index)}
            >
              <div class="card">
                <div class="card__title">{job.title}</div>
                <div class="card__subtitle">{job.description}</div>
                <h4>Salary: {job.salaryRate}$</h4>
                <div class="card__indicator">
                  <span class="card__indicator-amount">{job.workType}</span>-{" "}
                  <span class="card__indicator-percentage">
                    {job.workLocation}
                  </span>
                </div>
                <div class="card__progress">
                  <progress max="100" value="40"></progress>
                </div>
                <h5>
                  Interested for more information?{" "}
                  <h4 style={{ color: "red" }}>Contact Us</h4>
                </h5>
                <div class="card__subtitle">
                  Employer Name: {getEmployeeInfo(job.employerId)?.employerName}
                </div>
                <div class="card__subtitle">
                  Phone: {getEmployeeInfo(job.employerId)?.phone}
                </div>
                <div class="card__subtitle">
                  Email: {getEmployeeInfo(job.employerId)?.email}
                </div>
              </div>
            </TinderCard>
          </>
        ))}
        <div className="buttons">
          <div className="no" onClick={() => swipe("left")}>
            <i className="fas fa-times"></i>
          </div>
          <div className="star" onClick={() => goBack()}>
            <i className="fa fa-undo fa"></i>
          </div>
          <div className="heart" onClick={() => swipe("right")}>
            <i className="fas fa-heart"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
