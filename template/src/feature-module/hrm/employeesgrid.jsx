import React, { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  Edit,
  Grid,
  List,
  MoreVertical,
  PlusCircle,
  RotateCcw,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { ChevronUp, Users } from "react-feather";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const EmployeesGrid = () => {
  const route = all_routes;

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const MySwal = withReactContent(Swal);
  const showConfirmationAlert = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning", // เพิ่มไอคอนเพื่อแสดงความระมัดระวัง
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // เรียกใช้ฟังก์ชันสำหรับลบข้อมูลที่มี id นี้
        // deleteItem(id); // เพิ่มฟังก์ชันลบที่คุณต้องการเรียกใช้ที่นี่
        const apiUrl = process.env.REACT_APP_BAES_API;

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
          await axios.delete(`${apiUrl}/Employee/Delete?id=${id}`);

          // ปิดการแสดงผล Loading แล้วแสดงผลสำเร็จ
          Swal.fire({
            icon: "success",
            title: "ลบข้อมูลเรียบร้อย",
            text: "ข้อมูลพนักงานถูกลบเรียบร้อยแล้ว",
            confirmButtonColor: "#00ff00",
            confirmButtonText: "OK",
          });
          fetchEmployees(1); // เรียกฟังก์ชันเพื่อดึงข้อมูล
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
      } else {
        MySwal.close(); // ปิด SweetAlert ถ้าผู้ใช้ไม่ยืนยันการลบ
      }
    });
  };

  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // เพิ่ม state สำหรับจำนวนหน้า
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      await fetchEmployees(1);
    }

    await fetchEmployees(1); // เรียกฟังก์ชัน fetchDepartments พร้อมหมายเลขหน้าเริ่มต้น
  };
  // ฟังก์ชันสำหรับดึงข้อมูล Department
  const fetchEmployees = async (page) => {
    try {
      const apiUrl = process.env.REACT_APP_BAES_API;
      const response = await axios.get(
        `${apiUrl}/Employee/GetAll?page=${page}${
          searchTerm ? `&searchTerm=${searchTerm}` : ""
        }`
      );

      if (response.data.value && response.data.value.value.length > 0) {
        setEmployees(response.data.value.value); // Save data to state
      } else {
        setEmployees([]); // Set state to an empty array if no employees are found
      }
      // ตรวจสอบว่า API ส่งค่าจำนวนทั้งหมดกลับมาหรือไม่
      const totalRecords =
        response.data.value.totalCount || response.data.value.length; // ใช้ totalCount ถ้ามี
      const itemsPerPage = 10; // จำนวนข้อมูลต่อหน้า (ปรับตามต้องการ)

      // คำนวณจำนวนหน้าทั้งหมด
      setTotalPages(Math.ceil(totalRecords / itemsPerPage));
    } catch (error) {
      console.error("There was an error fetching the departments!", error);
    } finally {
      // setLoading(false); // ปิด Loading หลังจากดึงข้อมูลเสร็จสิ้น
    }
  };
  useEffect(() => {
    fetchEmployees(currentPage); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูก mount
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchEmployees(page); // เรียกฟังก์ชันเพื่อดึงข้อมูลสำหรับหมายเลขหน้าใหม่
  };
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Employees</h4>
                <h6>Manage your employees</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
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
            <div className="page-btn">
              <Link to={route.addemployee} className="btn btn-added">
                <PlusCircle className="me-2" />
                Add New Employee
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body pb-0">
              <div className="table-top table-top-two table-top-new">
                <div className="search-set mb-0">
                  <div className="total-employees">
                    <h6>
                      <Users />
                      Search
                    </h6>
                  </div>
                  <div className="search-input">
                    <Link to="" className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                    <input
                      type="search"
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าเมื่อมีการพิมพ์
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }} // เรียกฟังก์ชันเมื่อกด Enter
                      placeholder="Search..."
                    />{" "}
                  </div>
                </div>
                <div className="search-path d-flex align-items-center search-path-new">
                  <div className="d-flex">
                    <Link to={route.employeelist} className="btn-list">
                      <List />
                    </Link>
                    <Link to={route.employeegrid} className="btn-grid active">
                      <Grid />
                    </Link>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              {/* /Filter */}
            </div>
          </div>
          {/* /product list */}
          {employees.length > 0 ? (
            <>
          <div className="employee-grid-widget">
            <div className="row">
              {employees.map((employee) => (
                <div
                  key={employee.employee_ID}
                  className="col-xxl-3 col-xl-4 col-lg-6 col-md-6"
                >
                  <div className="employee-grid-profile">
                    <div className="profile-head">
                      <label className="checkboxs"></label>
                      <div className="profile-head-action">
                        <div className="dropdown profile-action">
                          <Link
                            to="#"
                            className="action-icon dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <MoreVertical />
                          </Link>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                to={`${route.editemployee}?id=${employee.employee_ID}`}
                                className="dropdown-item"
                              >
                                <Edit className="info-img" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="dropdown-item confirm-text mb-0"
                                onClick={() =>
                                  showConfirmationAlert(employee.employee_ID)
                                }
                              >
                                <Trash2 className="info-img" />
                                Delete
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-pic active-profile">
                        {employee.photo ? (
                          <>
                            <img
                              src={`data:image/jpeg;base64,${employee.photo}`}
                              alt="Employee Profile"
                              style={{ width: "100%", height: "80px" }}
                            />
                          </>
                        ) : (
                          <>
                            <ImageWithBasePath
                              src="assets/img/users/user-01.jpg"
                              alt=""
                            />
                          </>
                        )}
                      </div>
                      <h5>EMP ID : {employee.employee_ID}</h5>
                      <h4>
                        {employee.employee_First_name}{" "}
                        {employee.employee_Last_name}
                      </h4>
                      {/* <span>{employees}</span> */}
                    </div>
                    <ul className="department">
                      <li>
                        Joined
                        <span>
                          {moment(employee.date_Joined).format("DD-MM-YYYY")}
                        </span>
                      </li>
                      <li>
                        Department
                        <span>{employee.departmentName}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
          <div className="container-fluid">
            <div className="row custom-pagination">
              <div className="col-md-12">
                <div className="paginations d-flex justify-content-end mb-3">
                  <span
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "disabled" : ""}
                  >
                    <i className="fas fa-chevron-left" />
                  </span>
                  <ul className="d-flex align-items-center page-wrap">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <li key={pageNumber}>
                          <Link
                            to="#"
                            className={
                              currentPage === pageNumber ? "active" : ""
                            }
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <span
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "disabled" : ""}
                  >
                    <i className="fas fa-chevron-right" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          </>
          ) : (<>
          <p>No information...</p>
          </>)}
        </div>
      </div>
    </div>
  );
};

export default EmployeesGrid;
