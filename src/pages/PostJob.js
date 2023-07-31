import Nav from "../components/Nav";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OnBoarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [Title, setTitle] = useState();
  const [Description, setDescription] = useState();
  const [WorkLocation, setWorkLocation] = useState();
  const [WorkType, setWorkType] = useState("Onboard");
  const [SalaryRate, setSalaryRate] = useState(0);

  const handleCheckboxChange = (event) => {
    setWorkType(event.target.value);
  };

  const jobId = 0;
  const dateCreated = new Date();
  const dateUpdated = new Date();
  const employerId = cookies.UserInfo.employerId;
  const jobStatus = 1;
  const categoryId = 1;
  const SalaryType = "$(dolar)";

  const postJob = {
    jobId: jobId,
    title: Title,
    description: Description,
    dateCreated: dateCreated,
    dateUpdated: dateUpdated,
    workLocation: WorkLocation,
    workType: WorkType,
    salaryRate: parseFloat(SalaryRate),
    salaryType: SalaryType,
    jobStatus: jobStatus,
    employerId: employerId,
    categoryId: categoryId,
  };

  let navigate = useNavigate();

  const next = () => {
    navigate("/employMain");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://13.229.181.7/api/jobs",
        postJob
      );
      navigate("/payment");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />

      <div className="onboarding">
        <h2>POST A NEW JOB</h2>

        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">Job Title</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="Job Title"
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              name="description"
              placeholder="Description"
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Salary</label>
            <input
              id="salary"
              type="number"
              name="salary"
              placeholder="salary"
              required={true}
              onChange={(e) => setSalaryRate(e.target.value)}
            />

            <label>Work Type</label>

            <div className="multiple-input-container">
              <input
                id="man-gender-interest"
                type="radio"
                name="gender_interest"
                value="Onboard"
                checked={WorkType === "Onboard"}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="man-gender-interest">OnBoard</label>
              <input
                id="woman-gender-interest"
                type="radio"
                name="gender_interest"
                value="Remote"
                checked={WorkType === "Remote"}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="woman-gender-interest">Remote</label>
              <input
                id="everyone-gender-interest"
                type="radio"
                name="gender_interest"
                value="Hybird"
                checked={WorkType === "Hybird"}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="everyone-gender-interest">Hybird</label>
            </div>

            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Address"
              required={true}
              onChange={(e) => setWorkLocation(e.target.value)}
              maxLength="20"
            />

            <input type="submit" />
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
