import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { User, Jobs } from "./data";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function EmployMain() {
  const [UserList, setUserList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(30 - 1);
  const [lastDirection, setLastDirection] = useState();
  let navigate = useNavigate();

  const Logout = () => {
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
      Array(30)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < 30 - 1;

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
    if (canSwipe && currentIndex < 30) {
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
      const response = await axios.get(
        "https://647e3d68af984710854b1627.mockapi.io/users"
      );
      setUserList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div class="container">
      <div class="side">
        <div class="header">
          <div class="avatar">
            <img src={User.profileUrl} alt="" />
          </div>
          <div class="title">
            {User.name}{" "}
            <button onClick={Logout} style={{ marginLeft: "20px" }}>
              <span class="button_top"> Log Out</span>
            </button>
          </div>
        </div>
        <div class="menu">
          <ul>
            <li className="button" onClick={addJob}>
              Add Job
            </li>
            <li className="button" onClick={listJobs}>
              List Jobs
            </li>
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
      <div class="content">
        {UserList.map((job, index) => (
          <>
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={job.id}
              onSwipe={(dir) => swiped(dir, job.id, index)}
              onCardLeftScreen={() => outOfFrame(job.id, index)}
            >
              <article class="card">
                <div class="temporary_text">
                  <img
                    src={job.profileUrl}
                    alt=""
                    height="350px"
                    width="350px"
                    style={{ marginTop: "13px" }}
                  />
                </div>
                <div class="card_content">
                  <span class="card_title">
                    {job.name} ({job.birthday}y) - {job.gender}
                  </span>
                  <span class="card_subtitle">
                    <h5>{job.email}</h5>
                  </span>
                  <p class="card_description">
                    <li style={{ listStyle: "none" }}>
                      <i class="fas fa-solid fa-phone"></i> {job.phone}
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <i class="fas fa-map-marker-alt"></i> {job.location},{" "}
                      {job.address}
                    </li>
                    <i class="fas fa-solid fa-info"></i> {job.description}
                  </p>
                </div>
              </article>
            </TinderCard>
          </>
        ))}
        <div
          class="buttons"
          style={{ position: "absolute", bottom: "0%", marginBottom: "50px" }}
        >
          <div class="no" onClick={() => swipe("left")}>
            <i class="fas fa-times"></i>
          </div>
          <div class="star" onClick={() => goBack()}>
            <i class="fa fa-undo fa"></i>
          </div>
          <div class="heart" onClick={() => swipe("right")}>
            <i class="fas fa-heart"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployMain;
