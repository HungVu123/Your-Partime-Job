import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../images/754556407.png";
import { TextField } from "@mui/material";

export default function Payment() {
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/employMain");
  };

  return (
    <>
      <h4>Thanh Toán Với Momo</h4>
      <img src={image} alt="" style={{ width: "18%", height: "18%" }} />
      <div>
        <h5>
          Hãy mở app Momo lên để quét mã thanh toán hoặc bấm chuyển tiền vào số
          tài khoản MOMO Nguyễn Huỳnh Tuấn
        </h5>
        <h3>Số tiền 10.000VNĐ/1 bài</h3>
        <h5>Lời nhắn: CKDAYBAI</h5>
        <h5>Sau khi donate xong bạn sẽ có mã giao dịch của Momo</h5>
        <h5>
          Hẫy nhập mã giao dịch vào ô bên dưới, hệ thống sẽ tự xác nhận trong
          vòng 5 phút
        </h5>
      </div>
      <div>
        <h3>Thông tin giao dịch</h3>
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <TextField
              required
              id="standard-required"
              label="Required"
              helperText="SĐT của bạn"
              variant="standard"
            />
            <TextField
              required
              id="standard-required"
              label="Required"
              helperText="Mã giao dịch"
              variant="standard"
            />
          </div>

          <button
            className="cssbuttons-io-button"
            type="submit"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Next
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                ></path>
              </svg>
            </div>
          </button>
        </form>
      </div>
    </>
  );
}
