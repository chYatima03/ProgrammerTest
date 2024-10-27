import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom/dist";
import { all_routes } from "../../Router/all_routes";
import {
  Edit,
  Grid,
  List,
  MoreVertical,
  PlusCircle,
  RotateCcw,
  Trash2,
  Users,
} from "feather-icons-react/build/IconComponents";
import AddDepartment from "../../core/modals/hrm/adddepartment";
import EditDepartment from "../../core/modals/hrm/editdepartment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ChevronUp } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";

const DepartmentGrid = () => {
  const route = all_routes;

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // เพิ่ม state สำหรับจำนวนหน้า
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState(null);
  const [selectedDepartmentAddress, setSelectedDepartmentAddress] =
    useState(null);

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      await fetchDepartments(1);
    }


    await fetchDepartments(1); // เรียกฟังก์ชัน fetchDepartments พร้อมหมายเลขหน้าเริ่มต้น
  };
  const reFresh = async () => {
    await fetchDepartments(1);
  };
  // ฟังก์ชันสำหรับดึงข้อมูล Department
  const fetchDepartments = async (page) => {
    try {
      const apiUrl = process.env.REACT_APP_BAES_API;
      const response = await axios.get(
        `${apiUrl}/Department/GetAll?page=${page}${
          searchTerm ? `&searchTerm=${searchTerm}` : ""
        }`
      );

      setDepartments(response.data.value.value); // บันทึกข้อมูลลงใน state
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDepartments(page); // เรียกฟังก์ชันเพื่อดึงข้อมูลสำหรับหมายเลขหน้าใหม่
  };
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
          await axios.delete(`${apiUrl}/Department/Delete?id=${id}`);

          // ปิดการแสดงผล Loading แล้วแสดงผลสำเร็จ
          Swal.fire({
            icon: "success",
            title: "ลบข้อมูลเรียบร้อย",
            text: "ข้อมูลแผนกถูกลบเรียบร้อยแล้ว",
            confirmButtonColor: "#00ff00",
            confirmButtonText: "OK",
          });
          fetchDepartments(); // เรียกฟังก์ชันเพื่อดึงข้อมูล
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

  // ฟังก์ชันเปิด modal
  const openModal = (departmentId, departmentName, departmentAddress) => {
    setSelectedDepartmentId(departmentId);
    setSelectedDepartmentName(departmentName);
    setSelectedDepartmentAddress(departmentAddress);
  };

  useEffect(() => {
    fetchDepartments(currentPage); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Department</h4>
                <h6>Manage your departments</h6>
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
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={() => reFresh()}
                  >
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
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-department"
              >
                <PlusCircle className="me-2" />
                Add New Department
              </Link>
            </div>
          </div>
          {/* /product list */}
        
          <div className="card">
            <div className="card-body pb-0">
              <div className="table-top table-top-new">
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
                    />
                  </div>
                </div>
                <div className="search-path d-flex align-items-center search-path-new">
                  <div className="d-flex">
                    <Link to={route.departmentgrid} className="btn-list">
                      <List />
                    </Link>
                    <Link to={route.departmentgrid} className="btn-grid active">
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
          {departments.length > 0 ? (
            <>
          <div className="employee-grid-widget">
            <div className="row">
              {departments.map((department) => (
                <div
                  key={department.department_ID}
                  className="col-xxl-3 col-xl-4 col-lg-6 col-md-6"
                >
                  <div className="employee-grid-profile">
                    <div className="profile-head">
                      <div className="dep-name">
                        <h5 className="active">{department.department_Name}</h5>
                      </div>
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
                              {/* <button onClick={() => openModal(department.department_ID)}>Edit</button> */}
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-department"
                                onClick={() =>
                                  openModal(
                                    department.department_ID,
                                    department.department_Name,
                                    department.department_Address
                                  )
                                }
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
                                  showConfirmationAlert(
                                    department.department_ID
                                  )
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
                    <div className="profile-info department-profile-info">
                      <h4>{department.department_Address}</h4>
                    </div>
                    {/* <ul className="team-members">
                      <li>Total Members: 07</li>
                      <li>
                        <ul>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/users/user-01.jpg"
                                alt=""
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/users/user-02.jpg"
                                alt=""
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/users/user-03.jpg"
                                alt=""
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/users/user-04.jpg"
                                alt=""
                              />
                              <span>+4</span>
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul> */}
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
      <AddDepartment callParentFunction={fetchDepartments} />
      <EditDepartment
        departmentId={selectedDepartmentId}
        departmentName={selectedDepartmentName}
        departmentAddress={selectedDepartmentAddress}
        callParentFunction={fetchDepartments}
      />
    </div>
  );
};

export default DepartmentGrid;
