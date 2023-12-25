import React from 'react'
import { useNavigate } from 'react-router-dom';

const DoctorList = ({doc}) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/doctor/book-appointment/${doc._id}`)}
      >
        <div className="card-header">
          Dr. {doc.firstName} {doc.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Specialization</b> {doc.specialization}
          </p>
          <p>
            <b>Experience</b> {doc.experience}
          </p>
          <p>
            <b>Fees Per Consultation</b> {doc.feesPerConsultation}
          </p>
          <p>
            <b>Timings</b> {doc.timings[0]} - {doc.timings[1]}
          </p>
        </div>
      </div>
    </>
  )
}

export default DoctorList