import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

const EditDepartment = ({
  departmentId,
  departmentName,
  departmentAddress,
  callParentFunction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [depname, setDepName] = useState(departmentName);
  const [address, setAddress] = useState(departmentAddress);

  useEffect(() => {
    // ตั้งค่า address ตาม departmentAddress ที่ได้รับ
    if (departmentName) {
      setDepName(departmentName);
    }
    if (departmentAddress) {
      setAddress(departmentAddress);
    }
  }, [departmentAddress]);

  const handleAddressChange = (event) => {
    setAddress(event.target.value); // อัปเดตค่า address เมื่อมีการเปลี่ยนแปลง
  };

  const handleNameChange = (event) => {
    setDepName(event.target.value); // อัปเดตค่า departmentName เมื่อมีการเปลี่ยนแปลง
  };

  const handleSaveChanges = async () => {
    // ฟังก์ชันในการบันทึกการเปลี่ยนแปลง
    // คุณสามารถทำการส่งข้อมูลที่แก้ไขไปยัง server หรือจัดการข้อมูลที่นี่ได้
    // console.log("Department Name:", depname);
    // console.log("Department Address:", address);
    const apiUrl = process.env.REACT_APP_BAES_API;
    const editDepartment = {
      Department_ID: departmentId,
      Department_Name: depname,
      Department_Address: address,
    };
    console.log(editDepartment);

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
      await axios.post(`${apiUrl}/Department/CreateEdit`, editDepartment);

      // ปิดการแสดงผล Loading แล้วแสดงผลสำเร็จ
      Swal.fire({
        icon: "success",
        title: "บันทึกเรียบร้อย",
        text: "ข้อมูลแผนกถูกบันทึกเรียบร้อยแล้ว",
        confirmButtonText: "ตกลง",
      });
      callParentFunction(currentPage); // เรียกฟังก์ชันเพื่อดึงข้อมูล

      // เคลียร์ฟอร์มหลังจากบันทึก
      setDepName("");
      setAddress("");
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
      {/* Edit Department */}
      <div className="modal fade" id="edit-department">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Department</h4>
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
                  <form>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="mb-3">
                          <label className="form-label">Department Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={depname} // ใช้ value แทน defaultValue
                            onChange={handleNameChange} // เพิ่ม onChange
                            id="departmentAddress"
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
                            value={address}
                            onChange={handleAddressChange} // เพิ่ม onChange
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
                        type="button"
                        className="btn btn-submit"
                        data-bs-dismiss="modal"
                        onClick={handleSaveChanges} // เรียกใช้ฟังก์ชันเมื่อกด Save Changes
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
      {/* /Edit Department */}
    </div>
  );
};
// การกำหนด PropTypes
EditDepartment.propTypes = {
  departmentId: PropTypes.number.isRequired, // ID ของแผนก
  departmentAddress: PropTypes.string.isRequired,
  departmentName: PropTypes.string.isRequired,
  callParentFunction: PropTypes.func.isRequired, // ระบุว่า callParentFunction ต้องเป็นฟังก์ชันและต้องถูกส่งเข้ามา
};
export default EditDepartment;
