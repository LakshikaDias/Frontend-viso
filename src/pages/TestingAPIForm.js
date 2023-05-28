import React, { useState } from "react";
import "./TestingAPIForm.css";
import axios from "axios";

import { jsPDF } from "jspdf";

const TestingAPIForm = () => {
  const [format, setFormat] = useState("");
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    NIC: "",
    phoneNo: "",
    address: "",
    gender: "",
    profession: "",
    country: "",
    education: "",
  });
  const [userId, setUserId] = useState("");
  const [responseEducation, setResponseEducation] = useState("");

  //API URL
  const apiUrl = process.env.REACT_APP_APIURL || "http://localhost:5000/api";

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userDetails, "userDetails");

    try {
      const response = await axios.post(`${apiUrl}/user`, userDetails);
      console.log("new task succesfully added to the database:", response.data);
      setResponseEducation(response.data.education);
      setUserId(response.data._id);
    } catch (error) {
      alert("Server still starting, Please try again");
      return;
    }
  };

  const handleSubmitDownload = async (event) => {
    event.preventDefault();
    console.log(format);
    console.log(responseEducation, "responseEducation");

    try {
      const response = await axios.post(
        `${apiUrl}/download`,
        responseEducation
      );
      console.log(response.data, "response.data");

      createDocument(userDetails, response.data.response);
    } catch (error) {
      console.error(error);
      alert("Failed to connect ChatGPT");
    }
    setUserId("");
    setUserDetails({
      firstName: "",
      lastName: "",
      email: "",
      NIC: "",
      phoneNo: "",
      address: "",
      gender: "",
      profession: "",
      country: "",
      education: "",
    });
  };

  const createDocument = (personalDetails, educationDetals) => {
    //convert to pdf
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");

    const firstNameWidth = doc.getTextWidth(personalDetails.firstName);
    const lastNameWidth = doc.getTextWidth(personalDetails.lastName);
    const pageWidth = doc.internal.pageSize.getWidth();
    const firstNameX = (pageWidth - firstNameWidth) / 2;
    const lastNameX = (pageWidth - lastNameWidth) / 2;

    doc.text(personalDetails.firstName, firstNameX, 10);
    doc.text(personalDetails.lastName, lastNameX + 25, 10);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`\u2022 First Name : ${personalDetails.firstName}`, 30, 30);
    doc.text(`\u2022 Last Name : ${personalDetails.lastName}`, 30, 35);
    doc.text(`\u2022 NIC : ${personalDetails.NIC}`, 30, 40);
    doc.text(`\u2022 Address : ${personalDetails.address}`, 30, 45);

    doc.text(`\u2022 Country : ${personalDetails.country}`, 30, 65);
    doc.text(`\u2022 Phone no : ${personalDetails.phoneNo}`, 30, 70);
    doc.text(`\u2022 Email : ${personalDetails.email}`, 30, 75);
    doc.text(`\u2022 Profession : ${personalDetails.profession}`, 30, 80);
    doc.text(`\u2022 Gender : ${personalDetails.gender}`, 150, 70);

    doc.text("\u2022 Education : ", 30, 100);
    doc.text(educationDetals, 40, 100);

    // save the pdf document
    doc.save(`${userId}.pdf`);
  };

  return (
    <div>
      <div className="Testing">
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={userDetails.firstName}
            onChange={(event) =>
              setUserDetails({ ...userDetails, firstName: event.target.value })
            }
            required
          />
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={userDetails.lastName}
            onChange={(event) =>
              setUserDetails({ ...userDetails, lastName: event.target.value })
            }
          />
          <label htmlFor="NIC">NIC:</label>
          <input
            type="text"
            id="NIC"
            value={userDetails.NIC}
            onChange={(event) =>
              setUserDetails({ ...userDetails, NIC: event.target.value })
            }
            required
          />
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={userDetails.address}
            onChange={(event) =>
              setUserDetails({ ...userDetails, address: event.target.value })
            }
          />
          <label htmlFor="phoneNO">Phone NO:</label>
          <input
            type="tel"
            id="phoneNO"
            value={userDetails.phoneNo}
            onChange={(event) =>
              setUserDetails({ ...userDetails, phoneNo: event.target.value })
            }
            required
          />
          <label htmlFor="gender">Gender:</label>
          <select
            required
            value={userDetails.gender}
            onChange={(event) =>
              setUserDetails({ ...userDetails, gender: event.target.value })
            }
          >
            <option value="">None</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>

          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            value={userDetails.email}
            onChange={(event) =>
              setUserDetails({ ...userDetails, email: event.target.value })
            }
            required
          />

          <label htmlFor="profession">Profession:</label>
          <input
            type="text"
            id="profession"
            value={userDetails.profession}
            onChange={(event) =>
              setUserDetails({ ...userDetails, profession: event.target.value })
            }
            required
          />

          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            value={userDetails.country}
            onChange={(event) =>
              setUserDetails({ ...userDetails, country: event.target.value })
            }
            required
          />

          <label htmlFor="education">Education:</label>
          <input
            type="textarea"
            size="100"
            id="education"
            value={userDetails.education}
            onChange={(event) =>
              setUserDetails({ ...userDetails, education: event.target.value })
            }
            required
          />

          <br></br>
          <button type="submit">SignUp</button>
        </form>
      </div>

      <br></br>
      <br></br>

      {userId !== "" ? (
        <div>
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            Your Document is ready. You can download it
          </div>
          <br></br>
          <div>
            <form onSubmit={handleSubmitDownload}>
              <h3>Download the file</h3>

              <label htmlFor="format">Format:</label>
              <select
                required
                value="PDF"
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="">None</option>
                <option value="Word">Word</option>
                <option value="PDF">PDF</option>
              </select>
              <br></br>
              <br></br>
              <button type="submit">Download</button>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default TestingAPIForm;
