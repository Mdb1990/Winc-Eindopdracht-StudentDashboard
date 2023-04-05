import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryGroup,
} from "victory";
import { csv } from "d3";
import PersonCard from "./PersonCard";
import { studentPersona } from "./studentAllData";

import dataWinc from "./dataWinc.csv";
import { StudentList } from "./studentList";

import styles from "./StudentDash.module.css";

export const StudentDash = () => {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [chartDimensions, setChartDimensions] = useState({
    width: 1500,
    height: 500,
  });

  let navigate = useNavigate();

  // Helper function to convert string values to numbers
  const row = (d) => {
    d.Difficulty = +d.Difficulty;
    d.Fun = +d.Fun;
    return d;
  };

  // Load data and set up event listeners for window resizing
  useEffect(() => {
    csv(dataWinc, row).then((data) => {
      setData(data);
      setSelectedStudentsFromURL();
      updateChartDimensions();
      // Set initial state for selectedStudents and displayedStudents
      const initialStudentNames = [...new Set(data.map((item) => item.Name))];
      setSelectedStudents(initialStudentNames);
      setDisplayedStudents(studentPersona);
    });
  }, []);

  // Set selected students based on the URL parameter
  const setSelectedStudentsFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const studentParam = params.get("student");
    if (studentParam) {
      setSelectedStudents(studentParam.split(","));
    }
  };

  // Update chart dimensions based on window size
  const updateChartDimensions = () => {
    const chartWidth = 1500;
    const chartHeight = 500;

    setChartDimensions({ width: chartWidth, height: chartHeight });
  };

  // Clear button for clearing the selection
  const handleClearSelection = () => {
    setSelectedStudents([]);
    setDisplayedStudents([]);
    navigate("/home", { replace: true });
  };

  // Select button for Selecting all students (PersonCard)
  const handleSelectAll = () => {
    const initialStudentNames = [...new Set(data.map((item) => item.Name))];

    setSelectedStudents(initialStudentNames);
    setDisplayedStudents(studentPersona);
    navigate("/home", { replace: true });
  };

  // Handle student selection
  const handleStudentClick = (name) => {
    const everyStudentSelected =
      name === "Every Student" &&
      selectedStudents.length !== studentNames.length;

    const updatedStudents = everyStudentSelected
      ? studentNames
      : selectedStudents.includes(name)
      ? selectedStudents.filter((student) => student !== name)
      : [...selectedStudents, name];

    setSelectedStudents(updatedStudents);

    const clickedStudentsData = updatedStudents.map((studentName) => {
      const student = studentPersona.find(
        (student) => student.first_name === studentName
      );
      const studentInfo = data.find((d) => d.Name === studentName);
      return studentInfo && student ? { ...student, ...studentInfo } : student;
    });

    setDisplayedStudents(clickedStudentsData);

    const query = updatedStudents.length ? `/${updatedStudents.join(",")}` : "";
    navigate(`/home${query}`, { replace: true });
  };

  const assignments = [...new Set(data.map((item) => item.Assignment))];

  // Calculate average difficulty and fun for selected students
  const averageAll = (students) => {
    return assignments.map((assignment) => {
      const filteredData = students.length
        ? data.filter((item) => students.includes(item.Name))
        : data;

      const allData = filteredData.filter(
        (item) => item.Assignment === assignment
      );

      const sum = allData.reduce(
        (accumulator, current) => {
          accumulator.Difficulty += current.Difficulty;
          accumulator.Fun += current.Fun;
          return accumulator;
        },
        { Difficulty: 0, Fun: 0 }
      );

      const dataLength = allData.length || 1;
      return {
        Name: students.length ? "selected" : "all",
        Assignment: assignment,
        Difficulty: sum.Difficulty / dataLength,
        Fun: sum.Fun / dataLength,
      };
    });
  };

  const studentNames = [...new Set(data.map((item) => item.Name))];
  const studentData = averageAll(selectedStudents);

  return (
    <div className={styles["student-dash"]} style={{ height: 1 * data.length }}>
      <div className={styles["chart-wrapper"]}>
        <div className={styles["chart-container"]}>
          <VictoryChart
            width={chartDimensions.width}
            height={chartDimensions.height}
            padding={{ top: 100, bottom: 200, left: 100, right: 150 }}
            domain={{ x: [0, assignments.length - 1], y: [0, 5] }}
          >
            <VictoryAxis
              tickValues={assignments}
              tickFormat={(tick) => tick}
              style={{
                tickLabels: {
                  angle: 55,
                  transform: "translate(-10, -5)",
                  textAnchor: "start",
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickValues={[1, 2, 3, 4, 5]}
              style={{
                tickLabels: { fontSize: 15 },
              }}
              orientation="left"
              label="Average Difficulty/Fun"
            />
            <VictoryGroup offset={8} colorScale={"qualitative"}>
              {["Difficulty", "Fun"].map((type, index) => (
                <VictoryBar
                  key={type}
                  data={studentData}
                  x={(d) =>
                    assignments.length -
                    1 -
                    assignments.indexOf(d.Assignment) +
                    0.5
                  }
                  y={type}
                  style={{
                    data: {
                      fill: index === 0 ? "#82ca9d" : "#8884d8",
                      opacity:
                        dataType === "all" || dataType === type.toLowerCase()
                          ? 1
                          : 0,
                    },
                  }}
                  barWidth={8}
                  alignment="middle"
                  labels={({ datum }) =>
                    dataType === "all" || dataType === type.toLowerCase()
                      ? `${type} ${datum[type]}`
                      : ""
                  }
                  labelComponent={
                    <VictoryTooltip
                      cornerRadius={10}
                      pointerLength={10}
                      flyoutStyle={{
                        stroke: "none",
                        fill: "White",
                      }}
                    />
                  }
                />
              ))}
            </VictoryGroup>
          </VictoryChart>
        </div>
        <div className={styles["options-container"]}>
          <div className={styles["student-option"]}>
            <label>
              <input
                type="radio"
                name="dataType"
                value="all"
                checked={dataType === "all"}
                onChange={() => setDataType("all")}
              />
              All
            </label>
            <label>
              <input
                type="radio"
                name="dataType"
                value="fun"
                checked={dataType === "fun"}
                onChange={() => setDataType("fun")}
              />
              Fun
            </label>
            <label>
              <input
                type="radio"
                name="dataType"
                value="difficulty"
                checked={dataType === "difficulty"}
                onChange={() => setDataType("difficulty")}
              />
              Difficulty
            </label>
          </div>
        </div>
        <div className={styles["cards-container"]}>
          {displayedStudents.map((student) => (
            <PersonCard key={student.id} student={student} />
          ))}
        </div>
      </div>
      <StudentList
        onStudentClick={handleStudentClick}
        studentNames={studentNames}
        selectedStudents={selectedStudents}
        onClearSelection={handleClearSelection}
        handleSelectAll={handleSelectAll}
      />
    </div>
  );
};
