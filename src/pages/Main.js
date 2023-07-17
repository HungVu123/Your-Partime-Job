import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { User } from "./data";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function Main() {
  const [Jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(30 - 1);
  const [lastDirection, setLastDirection] = useState();
  let navigate = useNavigate();

  const getUser = async () => {
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
    getUser();
  }, []);

  const Logout = () => {
    navigate("/");
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
            <li>Matches</li>
            <li class="active">Message</li>
          </ul>
        </div>
        <div class="messages">
          <div class="avatar">
            <img
              src="https://randomuser.me/api/portraits/women/38.jpg"
              alt=""
            />
          </div>
          <div class="message">
            <div class="user">Caroline</div>
            <div class="text">Hello how can i help you</div>
          </div>
        </div>
      </div>
      <div class="content">
        {Jobs.map((job, index) => (
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
                    src={job.jobPhotoUrl}
                    alt=""
                    height="350px"
                    width="350px"
                    style={{ marginTop: "13px" }}
                  />
                </div>
                <div class="card_content">
                  <span class="card_title">
                    {job.name} - ${job.price}
                  </span>
                  <span class="card_subtitle">
                    <h5>{job.email}</h5>
                  </span>
                  <p class="card_description">
                    <li style={{ listStyle: "none" }}>
                      {job.category} - {job.workType}
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

export default Main;
