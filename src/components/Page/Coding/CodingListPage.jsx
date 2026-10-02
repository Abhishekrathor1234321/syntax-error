import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TcsHeader from "../TcsPrep/TcsHeader";

import {
  getTopics,
  getQuestions,
  getCodingProgress,
  isQuestionCompleted,
} from "../../../api/codingApi";

import "./CodingListPage.css";

const DIFFICULTIES = ["easy", "medium", "hard"];

function CodingListPage() {
  const navigate = useNavigate();

  const [topicMap, setTopicMap] = useState({});
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeDifficulty, setActiveDifficulty] =
    useState(null);

  const [questions, setQuestions] = useState([]);
  const [completedQuestions, setCompletedQuestions] =
    useState(new Set());

  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] =
    useState(false);


  /* =====================================================
     LOAD TOPICS
     ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadTopics() {
      try {
        setLoading(true);

        const data = await getTopics();

        if (!mounted) return;

        if (!data?.success) {
          setTopicMap({});
          return;
        }

        const map = {};

        (data.topics || []).forEach(
          ({ _id, count }) => {
            if (!_id?.topic) return;

            if (!map[_id.topic]) {
              map[_id.topic] = {};
            }

            map[_id.topic][_id.difficulty] =
              count;
          }
        );

        setTopicMap(map);
      } catch (error) {
        console.error(
          "Failed to load coding topics:",
          error
        );

        if (mounted) {
          setTopicMap({});
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      mounted = false;
    };
  }, []);


  /* =====================================================
     LOAD QUESTIONS
     ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadQuestions() {
      try {
        setQuestionsLoading(true);

        const data = await getQuestions(
          activeTopic,
          activeDifficulty
        );

        if (!mounted) return;

        if (data?.success) {
          setQuestions(data.questions || []);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error(
          "Failed to load coding questions:",
          error
        );

        if (mounted) {
          setQuestions([]);
        }
      } finally {
        if (mounted) {
          setQuestionsLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      mounted = false;
    };
  }, [activeTopic, activeDifficulty]);


  /* =====================================================
     LOAD USER PROGRESS
     ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadProgress() {
      const token =
        localStorage.getItem("token");

      if (!token) return;

      try {
        const data =
          await getCodingProgress();

        if (!mounted) return;

        if (
          data?.success &&
          Array.isArray(data.progress)
        ) {
          const completed = new Set(
            data.progress
              .filter(
                (item) =>
                  item.completed === true
              )
              .map((item) => item.slug)
          );

          setCompletedQuestions(
            completed
          );
        }
      } catch (error) {
        console.error(
          "Failed to load coding progress:",
          error
        );
      }
    }

    loadProgress();

    return () => {
      mounted = false;
    };
  }, []);


  /* =====================================================
     TOPICS
     ===================================================== */

  const topics =
    Object.keys(topicMap).sort();

  const getTopicTotal = (topic) => {
    return Object.values(
      topicMap[topic] || {}
    ).reduce(
      (total, count) =>
        total + Number(count || 0),
      0
    );
  };


  /* =====================================================
     QUESTION NAVIGATION
     ===================================================== */

  const openQuestion = (slug) => {
    navigate(`/coding/${slug}`);
  };


  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <>
      {/* =================================================
          COMMON TCS HEADER
          DO NOT CREATE HEADER HERE
         ================================================= */}

      <TcsHeader />


      {/* =================================================
          CODING CONTENT
         ================================================= */}

      <div className="coding-list-page">


        {/* =================================================
            LEFT - TOPICS
           ================================================= */}

        <aside className="coding-sidebar">

          <h2 className="coding-sidebar-title">
            Topics
          </h2>


          {/* ALL TOPICS */}

          <button
            type="button"
            className={`coding-topic-btn ${
              activeTopic === null
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTopic(null)
            }
          >
            <span>All topics</span>
          </button>


          {/* TOPIC LOADING */}

          {loading && (
            <p className="coding-muted">
              Loading...
            </p>
          )}


          {/* TOPICS */}

          {!loading &&
            topics.map((topic) => (
              <button
                type="button"
                key={topic}
                className={`coding-topic-btn ${
                  activeTopic === topic
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTopic(topic)
                }
              >
                <span>{topic}</span>

                <span className="coding-topic-count">
                  {getTopicTotal(topic)}
                </span>
              </button>
            ))}


          {/* =================================================
              DIFFICULTY
             ================================================= */}

          <h2
            className="coding-sidebar-title coding-difficulty-title"
          >
            Difficulty
          </h2>


          <div className="coding-difficulty-row">

            <button
              type="button"
              className={`coding-diff-chip ${
                activeDifficulty === null
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveDifficulty(null)
              }
            >
              All
            </button>


            {DIFFICULTIES.map(
              (difficulty) => (
                <button
                  type="button"
                  key={difficulty}
                  className={`coding-diff-chip diff-${difficulty} ${
                    activeDifficulty ===
                    difficulty
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveDifficulty(
                      difficulty
                    )
                  }
                >
                  {difficulty}
                </button>
              )
            )}

          </div>

        </aside>


        {/* =================================================
            RIGHT - QUESTIONS
           ================================================= */}

        <main className="coding-question-list">


          {/* =================================================
              HEADING
             ================================================= */}

          <div className="coding-heading-row">

            <h1 className="coding-heading">
              {activeTopic ||
                "All Questions"}

              {activeDifficulty && (
                <span className="coding-heading-sub">
                  {" "}
                  · {activeDifficulty}
                </span>
              )}
            </h1>


            <span className="coding-question-total">
              {questions.length} Questions
            </span>

          </div>


          {/* =================================================
              LOADING
             ================================================= */}

          {questionsLoading && (
            <div className="coding-loading">
              Loading questions...
            </div>
          )}


          {/* =================================================
              EMPTY
             ================================================= */}

          {!questionsLoading &&
            questions.length === 0 && (
              <p className="coding-muted coding-empty">
                No questions found for this
                filter yet.
              </p>
            )}


          {/* =================================================
              QUESTIONS
             ================================================= */}

          {!questionsLoading &&
            questions.length > 0 && (
              <div className="coding-question-cards">

                {questions.map((q) => {

                  const mongoCompleted =
                    completedQuestions.has(
                      q.slug
                    );

                  const localCompleted =
                    isQuestionCompleted(
                      q.slug
                    );

                  const completed =
                    mongoCompleted ||
                    localCompleted;


                  return (
                    <article
                      key={q._id}
                      className={`coding-question-card ${
                        completed
                          ? "question-completed"
                          : ""
                      }`}
                      onClick={() =>
                        openQuestion(
                          q.slug
                        )
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();

                          openQuestion(
                            q.slug
                          );
                        }
                      }}
                    >

                      {/* QUESTION TOP */}

                      <div className="coding-question-card-top">

                        <div className="coding-question-title-wrap">

                          {completed ? (
                            <span
                              className="coding-complete-icon"
                              title="Completed"
                            >
                              ✓
                            </span>
                          ) : (
                            <span
                              className="coding-pending-icon"
                              title="Not completed"
                            >
                              ○
                            </span>
                          )}

                          <span className="coding-question-title">
                            {q.title}
                          </span>

                        </div>


                        <span
                          className={`coding-diff-tag diff-${q.difficulty}`}
                        >
                          {q.difficulty}
                        </span>

                      </div>


                      {/* QUESTION BOTTOM */}

                      <div className="coding-question-card-bottom">

                        <span className="coding-question-topic">
                          {q.topic}
                        </span>

                        <span className="coding-question-points">
                          {q.points} pts
                        </span>

                        {completed && (
                          <span className="coding-done-label">
                            Done
                          </span>
                        )}

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </main>

      </div>
    </>
  );
}

export default CodingListPage;