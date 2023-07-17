import Nav from "../components/Nav";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OnBoarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    url: "",
    about: "",
    email: "",
    description: "",
    matches: [],
    salary: "",
  });

  let navigate = useNavigate();

  const next = () => {
    navigate("/employMain");
  };
  const handleSubmit = async (e) => {
    navigate("/payment");
    // console.log("submitted");
    // e.preventDefault();
    // try {
    //   const response = await axios.put("http://localhost:8000/user", {
    //     formData,
    //   });
    //   console.log(response);
    //   const success = response.status === 200;
    //   if (success) navigate("/employMain");
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleChange = (e) => {
    console.log("e", e);
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />

      <div className="onboarding">
        <h2>POST JOB</h2>

        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">Job Title</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="Job Title"
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />

            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              name="description"
              placeholder="Description"
              required={true}
              value={formData.description}
              onChange={handleChange}
            />

            <label>Date Created</label>
            <div className="multiple-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
                style={{ width: "60%" }}
              />

              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
                style={{ width: "60%" }}
              />

              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="YYYY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
                style={{ width: "60%" }}
              />
            </div>

            <label>Salary</label>
            <input
              id="salary"
              type="number"
              name="salary"
              placeholder="salary"
              required={true}
              value={formData.salary}
              onChange={handleChange}
              style={{ width: "60%" }}
            />

            <label>Work Type</label>

            <div className="multiple-input-container">
              <input
                id="man-gender-interest"
                type="radio"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === "man"}
              />
              <label htmlFor="man-gender-interest">OnBoard</label>
              <input
                id="woman-gender-interest"
                type="radio"
                name="gender_interest"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_interest === "woman"}
              />
              <label htmlFor="woman-gender-interest">Remote</label>
              <input
                id="everyone-gender-interest"
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === "everyone"}
              />
              <label htmlFor="everyone-gender-interest">Hybird</label>
            </div>

            <input type="submit" />
          </section>

          <section>
            <label htmlFor="url">Job Photo</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container">
              {formData.url && (
                <img src={formData.url} alt="profile pic preview" />
              )}
            </div>
          </section>
        </form>
        <div className="button" onClick={next}>
          Dont want to post a job ?
        </div>
      </div>
    </>
  );
};
export default OnBoarding;
