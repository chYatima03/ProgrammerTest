import React, { useState } from "react";
// import { Link } from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

const AddDepartment = ({ callParentFunction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentAddress, setDepartmentAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_BAES_API;
    const newDepartment = {
      Department_Name: departmentName,
      Department_Address: departmentAddress,
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
      await axios.post(`${apiUrl}/Department/CreateEdit`, newDepartment);

      // ปิดการแสดงผล Loading แล้วแสดงผลสำเร็จ
      Swal.fire({
        icon: "success",
        title: "บันทึกเรียบร้อย",
        text: "ข้อมูลแผนกถูกบันทึกเรียบร้อยแล้ว",
        confirmButtonText: "ตกลง",
      });
      callParentFunction(currentPage); // เรียกฟังก์ชันเพื่อดึงข้อมูล
      // เคลียร์ฟอร์มหลังจากบันทึก
      setDepartmentName("");
      setDepartmentAddress("");
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

  return (
    <div>
      {/* Add Department */}
      <div className="modal fade" id="add-department">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Department</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Department Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Department Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={departmentAddress}
                            onChange={(e) =>
                              setDepartmentAddress(e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-submit"
                        data-bs-dismiss="modal"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Department */}
    </div>
  );
};
// เพิ่มการตรวจสอบ props
AddDepartment.propTypes = {
    callParentFunction: PropTypes.func.isRequired, // ระบุว่า callParentFunction ต้องเป็นฟังก์ชันและต้องถูกส่งเข้ามา
};
export default AddDepartment;
