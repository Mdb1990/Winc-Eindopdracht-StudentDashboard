import React from "react";
import styles from "./StudentDash.module.css";

export const StudentList = ({
  studentNames,
  onStudentClick,
  selectedStudents,
  onClearSelection,
  handleSelectAll,
}) => {
  const handleCheckboxChange = (event) => {
    const name = event.target.value;
    onStudentClick(name);
  };

  return (
    <div className={styles["student-list-container"]}>
      <h3>Students</h3>
      <button onClick={handleSelectAll}>Select all</button>
      <button onClick={onClearSelection}>Clear Selection</button>
      <ul className={styles["student-list"]}>
        {studentNames.map((name) => (
          <li className="student-item" key={name}>
            <label>
              {" "}
              <input
                type="checkbox"
                value={name}
                checked={selectedStudents.includes(name)}
                onChange={handleCheckboxChange}
              />
              {name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
