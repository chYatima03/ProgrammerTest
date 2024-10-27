import { DatePicker } from "antd";
import { ChevronUp, Info } from "feather-icons-react/build/IconComponents";
import ArrowLeft from "feather-icons-react/build/IconComponents/ArrowLeft";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle } from "react-feather";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { setToogleHeader } from "../../core/redux/action";

const AddEmployee = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date); // กำหนดค่า selectedDate ให้เป็นวันที่ที่เลือก
    } else {
      console.error("Invalid date:", date);
    }
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    if (date) {
      setSelectedDate1(date);
    } else {
      console.error("Invalid date:", date);
    }
  };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [vgender, setVGender] = useState(null);
  const [department, setDepartment] = useState(null);
  const [address, setAddress] = useState("");
  // const [vcountry, setVCountry] = useState(null);
  const [province, setProvince] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [photo, setPhoto] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      setPhoto(base64String); // อัปเดต state ของ photo
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    // เริ่มต้นการอ่านไฟล์
    reader.readAsDataURL(file);
  };

  const gender = [
    { value: "Choose", label: "Choose" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "LGBTQ", label: "LGBTQ" },
  ];

  const [departments, setDepartments] = useState([]);
  // ฟังก์ชันสำหรับ Select (ดึงข้อมูลทั้งหมด)
  const fetchDepartmentsForSelect = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BAES_API;
      const response = await axios.get(`${apiUrl}/Department/GetAll`);
      setDepartments(
        response.data.value.value.map((dept) => ({
          label: dept.department_Name,
          value: dept.department_ID,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments for select:", error);
    }
  };

  const handleSaveChanges = async () => {

    const apiUrl = process.env.REACT_APP_BAES_API;
    const newEmp = {
      employee_First_name: firstName,
      employee_Last_name: lastName,
      employee_ID: empCode,
      gender: vgender,
      date_of_Birth: selectedDate,
      date_Joined: selectedDate,
      department_ID: department,
      employee_Address: `${address}|${subdistrict}|${district}|${province}|${zipcode}`,
      photo: photo,
    };

    // แสดง SweetAlert โหลด
    Swal.fire({
      title: "กำลังบันทึกข้อมูล...",
      text: "กรุณารอสักครู่",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post(`${apiUrl}/Employee/CreateEdit`, newEmp);

      // ปิดการแสดงผล Loading แล้วแสดงผลสำเร็จ
      Swal.fire({
        icon: "success",
        title: "บันทึกเรียบร้อย",
        text: "ข้อมูลแผนกถูกบันทึกเรียบร้อยแล้ว",
        confirmButtonText: "ตกลง",
      });

      // เคลียร์ฟอร์มหลังจากบันทึก
      setFirstName("");
      setLastName("");
      setEmpCode("");
      setVGender("");
      setDepartment("");
      setAddress("");
      setProvince("");
      setSubdistrict("");
      setDistrict("");
      setZipcode("");

      //   setStatus(true);
    } catch (error) {
      // ปิดการแสดงผล Loading แล้วแสดงข้อผิดพลาด
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        confirmButtonText: "ลองใหม่",
      });
      console.error("There was an error adding the department!", error);
    }
  };

  // ดึงข้อมูลเมื่อ component ถูก mount
  useEffect(() => {
    fetchDepartmentsForSelect();
  }, []);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>New Employee</h4>
                <h6>Create new Employee</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <div className="page-btn">
                  <Link to={route.employeegrid} className="btn btn-secondary">
                    <ArrowLeft className="me-2" />
                    Back to Employee List
                  </Link>
                </div>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
          {/* /product list */}

          <div className="card">
            <div className="card-body">
              <div className="new-employee-field">
                <div className="card-title-head">
                  <h6>
                    <span>
                      <Info className="feather-edit" />
                    </span>
                    Employee Information
                  </h6>
                </div>
                <div className="profile-pic-upload">
                  <div className="profile-pic">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Profile"
                        className="uploaded-image"
                      />
                    ) : (
                      <span>
                        <PlusCircle className="plus-down-add" />
                        Profile Photo
                      </span>
                    )}
                  </div>
                  <div className="input-blocks mb-0">
                    <div className="image-upload mb-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="image-uploads">
                        <h4>Change Image</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="empCode" className="form-label">
                        Emp Code
                      </label>
                      <input
                        type="text"
                        id="empCode"
                        className="form-control"
                        value={empCode}
                        onChange={(e) => setEmpCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="input-blocks">
                      <label>Date of Birth</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          type="date"
                          className="filterdatepicker"
                          dateFormat="dd-MM-yyyy"
                          placeholder="Choose Date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Gender</label>

                      <Select
                        classNamePrefix="react-select"
                        options={gender}
                        onChange={(selectedOption) =>
                          setVGender(selectedOption.value)
                        }
                        placeholder="Choose"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="input-blocks">
                      <label>Joining Date</label>
                      <div className="input-groupicon calender-input">
                        <DatePicker
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          type="date"
                          className="filterdatepicker"
                          dateFormat="dd-MM-yyyy"
                          placeholder="Choose Date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Department</label>

                      <Select
                        classNamePrefix="react-select"
                        options={departments}
                        onChange={(selectedOption) =>
                          setDepartment(selectedOption.value)
                        }
                        placeholder="Choose"
                      />
                    </div>
                  </div>
                </div>
                <div className="other-info">
                  <div className="card-title-head">
                    <h6>
                      <span>
                        <Info className="feather-edit" />
                      </span>
                      Other Information
                    </h6>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-control"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {/* <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Country</label>

                          <Select
                            classNamePrefix="react-select"
                            options={country}
                            placeholder="Select"
                          />
                        </div>
                      </div> */}
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Zipcode</label>
                        <input
                          type="text"
                          id="zipcode"
                          className="form-control"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label htmlFor="province" className="form-label">
                          Province
                        </label>
                        <input
                          type="text"
                          id="province"
                          className="form-control"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label htmlFor="district" className="form-label">
                          District
                        </label>
                        <input
                          type="text"
                          id="district"
                          className="form-control"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label htmlFor="subdistrict" className="form-label">
                          Subdistrict
                        </label>
                        <input
                          type="text"
                          id="subdistrict"
                          className="form-control"
                          value={subdistrict}
                          onChange={(e) => setSubdistrict(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="pass-info">
                    <div className="card-title-head">
                      <h6>
                        <span>
                          <Info />
                        </span>
                        Password
                      </h6>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="input-blocks mb-md-0 mb-sm-3">
                          <label>Password</label>
                          <div className="pass-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="pass-input"
                              placeholder="Enter your password"
                            />
                            <span
                              className={`fas toggle-password ${
                                showPassword ? "fa-eye" : "fa-eye-slash"
                              }`}
                              onClick={handleTogglePassword}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="input-blocks mb-0">
                          <label>Confirm Password</label>
                          <div className="pass-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="pass-input"
                              placeholder="Enter your password"
                            />
                            <span
                              className={`fas toggle-password ${
                                showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                              }`}
                              onClick={handleToggleConfirmPassword}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
              </div>
            </div>
          </div>
          {/* /product list */}
          <div className="text-end mb-3">
            <button type="button" className="btn btn-cancel me-2">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
