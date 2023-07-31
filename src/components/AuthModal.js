import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [phone, setphone] = useState(null);

  //Employee
  const [employerName, setemployerName] = useState(null);
  const [company, setcompany] = useState(null);

  //Students
  const [firstName, setfirstName] = useState(null);
  const [lastName, setlastName] = useState(null);
  const [studentAddress, setstudentAddress] = useState(null);

  const studentStatus = 1;
  const employerStatus = 1;
  const employerId = 0;
  const studentId = 0;

  const [error, setError] = useState(null);
  // const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isChecked, setIsChecked] = useState(false);

  const [state, setState] = useState(false);
  const [state1, setState1] = useState(false);

  const handleClose = () => {
    setState(false);
  };

  const handleClose1 = () => {
    setState1(false);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };

  const StudentRegister = {
    studentId: studentId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    pwd: password,
    phone: phone,
    studentAddress: studentAddress,
    studentStatus: studentStatus,
  };

  const EmployerRegister = {
    employerId: employerId,
    employerName: employerName,
    company: company,
    email: email,
    pwd: password,
    phone: phone,
    employerStatus: employerStatus,
  };

  const Login = {
    email: email,
    pwd: password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp === false && email === "admin@gmail.com" && password === "1") {
      navigate("/admin");
    } else {
      try {
        if (isSignUp && password !== confirmPassword) {
          setError("Passwords need to match!");
          return;
        }

        axios
          .post(
            `http://13.229.181.7/api/Account/${
              isSignUp
                ? isChecked
                  ? "EmployerRegister"
                  : "StudentRegister"
                : isChecked
                ? "EmployerLogin"
                : "StudentLogin"
            }`,
            isSignUp ? (isChecked ? EmployerRegister : StudentRegister) : Login
          )
          .then((response) => {
            // Handle successful login here
            setCookie("UserInfo", response.data);
            if (isSignUp) {
              setShowModal(false);
              setState1(true);
            } else {
              if (isChecked === false && !isSignUp) navigate("/main");
              if (isChecked === true && !isSignUp) navigate("/postJob");
            }
          })
          .catch((error) => {
            // Handle login error here
            setState(true);
            console.error("Login error:", error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="auth-modal">
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={state}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          variant="filled"
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Login/Register
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={state1}
        autoHideDuration={6000}
        onClose={handleClose1}
      >
        <Alert
          variant="filled"
          onClose={handleClose1}
          severity="success"
          sx={{ width: "100%" }}
        >
          Register successful
        </Alert>
      </Snackbar>

      <div className="close-icon" onClick={handleClick}>
        ⓧ
      </div>

      <h2>{isSignUp ? "TẠO TÀI KHOẢN" : "ĐĂNG NHẬP"}</h2>
      <p>
        By clicking Log In, you agree to our terms. Learn how we process your
        data in our Privacy Policy and Cookie Policy.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <>
            <input
              type="password"
              id="password-check"
              name="password-check"
              placeholder="confirm password"
              required={true}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="phone (10 digits)"
              required={true}
              pattern="[0-9]{10}"
              onChange={(e) => setphone(e.target.value)}
            />
          </>
        )}
        {isSignUp && !isChecked && (
          <>
            <input
              type="text"
              id="text"
              name="text"
              placeholder="firstName"
              required={true}
              onChange={(e) => setfirstName(e.target.value)}
            />
            <input
              type="text"
              id="text1"
              name="text1"
              placeholder="lastName"
              required={true}
              onChange={(e) => setlastName(e.target.value)}
            />
            <input
              type="text"
              id="text3"
              name="text3"
              placeholder="studentAddress"
              required={true}
              onChange={(e) => setstudentAddress(e.target.value)}
            />
          </>
        )}

        {isSignUp && isChecked && (
          <>
            <input
              type="text"
              id="text4"
              name="text4"
              placeholder="employerName"
              required={true}
              onChange={(e) => setemployerName(e.target.value)}
            />
            <input
              type="text"
              id="text5"
              name="text5"
              placeholder="company"
              required={true}
              onChange={(e) => setcompany(e.target.value)}
            />
          </>
        )}
        <div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="vehicle1">Bạn có phải là doanh nghiệp ?</label>
        </div>
        <button className="secondary-button">Submit</button>
        <p style={{ color: "red" }}>{error}</p>
      </form>
    </div>
  );
};
export default AuthModal;
