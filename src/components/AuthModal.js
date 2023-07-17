import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  console.log(isSignUp);
  const handleButtonClick = () => {
    if (
      isSignUp === false &&
      email === "admin@gmail.com" &&
      password === "123"
    ) {
      navigate("/admin");
    } else if (
      isChecked === false &&
      isSignUp === false &&
      email !== null &&
      password !== null
    ) {
      navigate("/onboarding");
    } else if (isChecked === true && isSignUp === false) {
      navigate("/postJob");
    } else {
      setShowModal(false);
    }
  };

  let navigate = useNavigate();

  console.log(email, password, confirmPassword);

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      const success = response.status === 201;
      if (success && isSignUp) navigate("/onboarding");
      if (success && !isSignUp) navigate("/dashboard");

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-modal">
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
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="confirm password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <div>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label for="vehicle1">Bạn có phải là doanh nghiệp ?</label>
        </div>
        <button className="secondary-button" onClick={handleButtonClick}>
          Submit
        </button>
        <p>{error}</p>
      </form>
    </div>
  );
};
export default AuthModal;
