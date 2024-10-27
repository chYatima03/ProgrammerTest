// import { DatePicker } from "antd";
import { ChevronUp, Info } from "feather-icons-react/build/IconComponents";
import ArrowLeft from "feather-icons-react/build/IconComponents/ArrowLeft";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import moment from "moment";
import Swal from "sweetalert2";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { PlusCircle } from "react-feather";
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";

const EditEmployee = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedDate1, setSelectedDate1] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const gender = [
    { value: "Choose", label: "Choose" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "LGBTQ", label: "LGBTQ" },
  ];

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  const location = useLocation();
  const [departments, setDepartments] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    // const imageUrl = URL.createObjectURL(file);

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      setSelectedImage(base64String);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    // เริ่มต้นการอ่านไฟล์
    reader.readAsDataURL(file);
  };

  const handleBirthChange = (event) => {
    setSelectedDate(event.target.value); // อัปเดตค่า departmentName เมื่อมีการเปลี่ยนแปลง
  };
  const handleJoiningChange = (event) => {
    setSelectedDate1(event.target.value); // อัปเดตค่า departmentName เมื่อมีการเปลี่ยนแปลง
  };
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
  const convertToISODate = (dateString) => {
    if (!dateString.includes("/")) {
      return dateString;
    }
    // แยกปี, เดือน และวันจากสตริง
    const [year, month, day] = dateString.split("/");

    // สร้างวันที่ในรูปแบบ ISO
    const isoDate = new Date(`${year}-${month}-${day}T17:00:00`);

    return isoDate.toISOString(); // คืนค่าวันที่ในรูปแบบ ISO
  };
  // ฟังก์ชันสำหรับดึงค่า query parameters
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get("id");
  };
  // เรียก API โดยใช้ employeeId

  useEffect(() => {
    fetchDepartmentsForSelect();

    const employeeId = getQueryParams();
    const fetchEmployeeData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BAES_API;
        const response = await axios.get(
          `${apiUrl}/Employee/Get?id=${employeeId}`
        );

        // Check if response has the expected data structure
        if (response.data && response.data.value) {
          setEmployeeData(response.data.value); // Assuming response.data.value holds the employee data
          setEmpCode(response.data.value.employee_ID);
          setFirstName(response.data.value.employee_First_name);
          setLastName(response.data.value.employee_Last_name);

          setVGender(response.data.value.gender);
          setDepartment(response.data.value.department_ID);
          const adss = response.data.value.employee_Address;
          const pathAddress = adss.split("|");
          setProvince(pathAddress[3]);
          setSubdistrict(pathAddress[1]);
          setDistrict(pathAddress[2]);
          setZipcode(pathAddress[4]);
          setAddress(pathAddress[0]);
          setSelectedDate(response.data.value.date_of_Birth);
          setSelectedDate1(response.data.value.date_Joined);
          setSelectedImage(response.data.value.photo);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [location]);

  const handleFistChange = (event) => {
    setFirstName(event.target.value); // อัปเดตค่า address เมื่อมีการเปลี่ยนแปลง
  };

  const handleLastChange = (event) => {
    setLastName(event.target.value); // อัปเดตค่า departmentName เมื่อมีการเปลี่ยนแปลง
  };
  const handleEmpChange = (event) => {
    setEmpCode(event.target.value); // อัปเดตค่า departmentName เมื่อมีการเปลี่ยนแปลง
  };

  const handleSaveChanges = async () => {
    // ฟังก์ชันในการบันทึกการเปลี่ยนแปลง

    const apiUrl = process.env.REACT_APP_BAES_API;
    const editEmployee = {
      employee_ID: empCode,
      department_ID: department,
      employee_First_name: firstName,
      employee_Last_name: lastName,
      gender: vgender,
      date_of_Birth: convertToISODate(selectedDate),
      date_Joined: convertToISODate(selectedDate1),
      employee_Address: `${address}|${subdistrict}|${district}|${province}|${zipcode}`,
      photo: selectedImage,
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
      await axios.post(`${apiUrl}/Employee/CreateEdit`, editEmployee);

      // ปิดการแสดงผล Loading แล้วแสดงผลสำเร็จ
      Swal.fire({
        icon: "success",
        title: "บันทึกเรียบร้อย",
        text: "ข้อมูลแผนกถูกบันทึกเรียบร้อยแล้ว",
        confirmButtonText: "ตกลง",
      });
      // callParentFunction(currentPage); // เรียกฟังก์ชันเพื่อดึงข้อมูล

      // เคลียร์ฟอร์มหลังจากบันทึก
      // setDepName("");
      // setAddress("");
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

    // หลังจากบันทึกแล้วสามารถปิด modal
    // onClose();
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Edit Employee</h4>
                <h6>Edit Employee</h6>
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
          {employeeData ? (
            <>
              <form>
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
                              className="uploaded-image"
                              src={`data:image/jpeg;base64,${selectedImage}`}
                              alt="Employee Profile"
                              style={{ width: "100%", height: "80px" }}
                            />
                          ) : (
                            // <img
                            //   src={selectedImage}
                            //   alt="Profile"
                            //   className="uploaded-image"
                            // />
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
                            <label className="form-label">First Name</label>
                            {employeeData ? (
                              <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                onChange={handleFistChange} // เพิ่ม onChange
                              />
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Loading..."
                                disabled
                              />
                            )}
                            {/* <input type="text" className="form-control" value={employeeData.employee_First_name}  /> */}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            {employeeData ? (
                              <input
                                type="text"
                                className="form-control"
                                value={lastName}
                                onChange={handleLastChange}
                              />
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Loading..."
                                disabled
                              />
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Emp Code</label>
                            {employeeData ? (
                              <input
                                type="text"
                                className="form-control"
                                value={empCode}
                                onChange={handleEmpChange}
                              />
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Loading..."
                                disabled
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="input-blocks">
                            <label>Date of Birth</label>
                            <div className="input-groupicon calender-input">
                              <InputMask
                                className="form-control"
                                mask="9999/99/99"
                                value={selectedDate}
                                onChange={handleBirthChange}
                              ></InputMask>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Gender</label>

                            <Select
                              classNamePrefix="react-select"
                              options={gender}
                              placeholder="Choose"
                              value={gender.find(
                                (option) => option.value === vgender
                              )} // ตั้งค่าให้แสดงค่าเดิม
                              onChange={(selectedOption) =>
                                setVGender(selectedOption.value)
                              } // อัปเดตค่าเมื่อเลือก
                            />
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                          <div className="input-blocks">
                            <label>Joining Date</label>
                            <div className="input-groupicon calender-input">
                              <InputMask
                                className="form-control"
                                mask="9999/99/99"
                                value={selectedDate1}
                                onChange={handleJoiningChange}
                              ></InputMask>
                             
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Department</label>

                            <Select
                              classNamePrefix="react-select"
                              options={departments}
                              placeholder="Choose"
                              value={departments.find(
                                (option) => option.value === department
                              )} // ตั้งค่าให้แสดงค่าเดิม
                              onChange={(selectedOption) =>
                                setDepartment(selectedOption.value)
                              } // อัปเดตค่าเมื่อเลือก
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
                              {employeeData ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Loading..."
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Zipcode</label>
                              {employeeData ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={zipcode}
                                  onChange={(e) => setZipcode(e.target.value)}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Loading..."
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                              <label htmlFor="province" className="form-label">
                                Province
                              </label>
                              {employeeData ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={province}
                                  onChange={(e) => setProvince(e.target.value)}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Loading..."
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                              <label htmlFor="district" className="form-label">
                                District
                              </label>
                              {employeeData ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={district}
                                  onChange={(e) => setDistrict(e.target.value)}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Loading..."
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <div className="mb-3">
                              <label
                                htmlFor="subdistrict"
                                className="form-label"
                              >
                                Subdistrict
                              </label>
                              {employeeData ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={subdistrict}
                                  onChange={(e) =>
                                    setSubdistrict(e.target.value)
                                  }
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Loading..."
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /product list */}
                <div className="text-end mb-3">
                  <button type="button" className="btn btn-cancel me-2">
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-submit"
                    onClick={handleSaveChanges} // เรียกใช้ฟังก์ชันเมื่อกด Save Changes
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p>Loading employee data...</p> // แสดงข้อความระหว่างรอโหลดข้อมูล
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
