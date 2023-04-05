// profileCard.js
import React from "react";
import styles from "./StudentDash.module.css";

const PersonCard = ({ student }) => {
  const { first_name, last_name, email, Age, Photo } = student;

  return (
    <div className={styles["Personcard"]}>
      <img src={Photo} alt={`${first_name} ${last_name}`} />
      <h3>{`${first_name} ${last_name}`}</h3>
      <p>Age: {Age}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default PersonCard;
