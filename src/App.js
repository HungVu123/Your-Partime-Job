import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import PostJob from "./pages/PostJob";
import { Route, Routes } from "react-router-dom";
// import { useCookies } from "react-cookie";
import Main from "./pages/Main";
import EmployMain from "./pages/EmployMain";
import Payment from "./pages/Payment";
import ListJobs from "./pages/ListJobs";
import Admin from "./pages/Admin";

const App = () => {
  // const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // const authToken = cookies.AuthToken;

  const authToken = true;
  return (
    <>
      <Routes>
        <Route path="/Your-Partime-Job" element={<Home />} />
        <Route path="/postJob" element={<PostJob />} />
        <Route path="/main" element={<Main />} />
        <Route path="/employMain" element={<EmployMain />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/listJobs" element={<ListJobs />} />
        <Route path="/admin" element={<Admin />} />
        {authToken && <Route path="/dashboard" element={<Dashboard />} />}
        {authToken && <Route path="/onboarding" element={<OnBoarding />} />}
      </Routes>
    </>
  );
};

export default App;
