import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import StatisticsComponent from "./StatisticsComponent";
import { Card, CardHeader, Collapse } from "reactstrap";
import { NotAuthorized } from "./NotAuthorized";

//Checks if the localStorage token is the one sent by the backend, or if it has been modified
async function checkLogin() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:9103/intelliq_api/check-login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-observatory-auth": token,
      },
    }
  );

  return response.status === 200;
}

export function StatisticsListPage() {
  const { id } = useParams();
  const [questionnaireData, setquestionnaireData] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin()
      .then((isLoggedIn) => {
        setIsLoggedIn(isLoggedIn);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`http://localhost:9103/intelliq_api/questionnaire/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setquestionnaireData(data);
        })
        .catch((error) => console.error(error));
    }
  }, [id, isLoggedIn]);

  const handleClick = (qID) => {
    if (expandedQuestions.includes(qID)) {
      setExpandedQuestions(expandedQuestions.filter((id) => id !== qID));
    } else {
      setExpandedQuestions([...expandedQuestions, qID]);
    }
  };

  if (!isLoggedIn) {
    return <NotAuthorized />;
  }

  return questionnaireData.questions ? (
    <>
      <h1>Statistics List Page for {id}</h1>
      {questionnaireData.questions.map((question) => {
        if (question.qID.startsWith("Q")) {
          return (
            <Card key={question.qID} className="mb-2">
              <CardHeader
                onClick={() => handleClick(question.qID)}
                style={{ cursor: "pointer" }}
              >
                {question.qID} - {question.qtext}
              </CardHeader>
              <Collapse isOpen={expandedQuestions.includes(question.qID)}>
                <StatisticsComponent
                  questionnaireID={questionnaireData.questionnaireID}
                  qID={question.qID}
                />
              </Collapse>
            </Card>
          );
        }
        return null;
      })}
    </>
  ) : (
    <h2>Loading...</h2>
  );
}
