import Image from "next/image";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import styles from "@/styles/components/FilmCard.module.css";

import { EvaluationBox } from "@/components/EvaluationBox";

import viewIcon from "@/assets/viewIcon.png";
import likeIcon from "@/assets/likeIcon.png";
import dislikeIcon from "@/assets/dislikeIcon.png";
import estrelaIcon from "@/assets/estrelaIcon.png";
import closeIcon from "@/assets/closeIcon.png";
import fullStar from "@/assets/fullStar.png";
import emptyStar from "@/assets/emptyStar.png";
import removeFilmIcon from "@/assets/removeFilmIcon.png";
import addFilmIcon from "@/assets/addFilmIcon.png";
import NA from "@/assets/NA.jpg";

const movieType = [
  "NETFLIX",
  "AMAZON",
  "HBO",
  "DISNEY",
  "STARPLUS",
  "CLARO",
  "PIRATEX",
];

import { api } from "@/services/api";
import { useRouter } from "next/router";

export function FilmCard({
  authorization,
  wasWatched,
  imdbId,
  cardImage,
  filmViews,
  filmRating,
  filmLikes,
  filmDislikes,
  isAdmin,
}) {
  const router = useRouter();
  const [likes, setLikes] = useState(filmLikes);
  const [dislikes, setDislikes] = useState(filmDislikes);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [watchedOn, setWatchedOn] = useState("0");
  const [isFilled, setIsFilled] = useState(false);
  const [hover, setHover] = useState(0);
  const [hasFirstSubmited, setHasFirstSubmited] = useState(false);
  const [hasSubmited, setHasSubmited] = useState(false);
  const [isEvaluationBoxExpanded, setIsEvaluationBoxExpanded] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isHoveredAdmin, setIsHoveredAdmin] = useState(false);

  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [filmTitle, setFilmTitle] = useState("");
  const [filmYear, setFilmYear] = useState("");
  const [filmGenres, setFilmGenres] = useState("");
  const [filmDescription, setFilmDescription] = useState("");
  const [evaluations, setEvaluations] = useState([]);

  const [currentEvaluation, setCurrentEvaluation] = useState({});

  useEffect(() => {
    async function key() {
      const handleKeyPress = (event) => {
        if (event.key === "Escape") {
          handleClose();
        }
      };
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }

    key();
  }, []);

  const requestGetMovie = async (authorization, imdbId) => {
    let response;
    try {
      response = await api.get("/api/movie?imdbId=" + imdbId, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (err) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (response.data.likeStatus == "liked") {
      setHasLiked(true);
    } else if (response.data.likeStatus == "disliked") {
      setHasDisliked(true);
    }

    setFilmTitle(response.data.title);
    setFilmYear(response.data.year);
    setFilmGenres(response.data.genre);
    setFilmDescription(response.data.plot);

    const evaluations = [];
    for (let i = 0; i < response.data.evaluations.length; i++) {
      const evaluation = {
        username: response.data.evaluations[i].user.name,
        profilePic:
          "http://api-petflix.pet.inf.ufes.br/public/avatar/" +
          response.data.evaluations[i].user.profilePic +
          ".png",
        watchedOn: response.data.evaluations[i].stream,
        rating: response.data.evaluations[i].rating,
        evaluation: response.data.evaluations[i].comment,
      };

      evaluations.push(evaluation);
    }
    setEvaluations(evaluations);
  };

  const requestReadUser = async (authorization) => {
    let response;
    try {
      response = await api.get("/api/user", {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (err) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    setUsername(response.data.user.name);
    setProfilePic(
      "http://api-petflix.pet.inf.ufes.br/public/avatar/" +
        response.data.user.profilePic +
        ".png"
    );
  };

  const requestLike = async (authorization, imdbId) => {
    try {
      await api.put("/api/react/like?imdbId=" + imdbId, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (err) {}
  };

  const requestDislike = async (authorization, imdbId) => {
    try {
      await api.put("/api/react/dislike?imdbId=" + imdbId, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (err) {}
  };

  const handleClick = async () => {
    await requestReadUser(authorization);
    await requestGetMovie(authorization, imdbId);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleCloseSubmitBox = () => {
    setIsEvaluationBoxExpanded(false);
  };

  const handleCommentChange = (e) => {
    const { value } = e.target;
    setComment(value.substring(0, 140));
  };

  function handleRatingClick(value) {
    setRating(value);
    setHover(value);
    setIsFilled(true);
  }

  function handleSelect() {
    const selectElement = document.getElementById("selectWatchedOn");
    const selectedOptionValue =
      selectElement.options[selectElement.selectedIndex].value;
    setWatchedOn(selectedOptionValue);
  }

  function handleSubmmitEvaluation(e) {
    e.preventDefault();

    async function fetchData() {
      try {
        const response = await api.get("/api/user");
        //console.log(response.data)
        response.data.evaluations.forEach((evaluation) => {
          if (evaluation.imdbId == imdbId) {
            setCurrentEvaluation(evaluation);
            setHasSubmited(true);
          }
        });
      } catch (err) {}
    }
    fetchData();
    if (comment.length > 0) {
      setIsEvaluationBoxExpanded(true);
      if (!hasFirstSubmited) setHasFirstSubmited(true);
      else setHasSubmited(true);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    handleCloseSubmitBox();
    try {
      const res = await api.post("/api/evaluation", {
        comment,
        rating,
        stream: movieType[watchedOn],
        imdbId,
      });
      router.reload(window.location.pathname);
    } catch (err) {
      console.log(err);
    }
    setComment("");
    setRating(0);
    setWatchedOn(0);
  }

  async function handleUpdateComment(e) {
    e.preventDefault();
    handleCloseSubmitBox();
    // console.log(comment, rating, watchedOn)
    try {
      const res = await api.put(
        "/api/evaluation",
        {
          comment,
          rating,
          stream: movieType[watchedOn],
        },
        {
          params: {
            id: currentEvaluation.id,
          },
        }
      );
      router.reload(window.location.pathname);
    } catch (err) {
      console.log(err);
    }
    setComment("");
    setRating(0);
    setWatchedOn(0);
  }

  async function handleLike() {
    if (!hasLiked) {
      setHasLiked(true);
      setLikes(likes + 1);
    } else {
      setHasLiked(false);
      setLikes(likes - 1);
    }

    if (hasDisliked) {
      setHasDisliked(false);
      setDislikes(dislikes - 1);
      await requestDislike(authorization, imdbId);
    }

    await requestLike(authorization, imdbId);
  }

  async function handleDislike() {
    await requestDislike(authorization, imdbId);

    if (!hasDisliked) {
      setHasDisliked(true);
      setDislikes(dislikes + 1);
    } else {
      setHasDisliked(false);
      setDislikes(dislikes - 1);
    }

    if (hasLiked) {
      setHasLiked(false);
      setLikes(likes - 1);
      await requestLike(authorization, imdbId);
    }

    await requestDislike(authorization, imdbId);
  }

  function handleHoverInAdmin() {
    if (isAdmin) {
      setIsHoveredAdmin(true);
    }
  }

  function handleHoverOutAdmin() {
    if (isAdmin) {
      setIsHoveredAdmin(false);
    }
  }

  const card = (
    <div
      className={styles.filmCard}
      onClick={handleClick}
      onMouseEnter={handleHoverInAdmin}
      onMouseLeave={handleHoverOutAdmin}
      onPress
    >
      <Image
        className={styles.filmImage}
        width={300}
        height={445}
        src={cardImage === "N/A" ? NA : cardImage}
        alt={filmTitle + " foto de capa"}
      />
      {isHoveredAdmin && wasWatched && (
        <Image className={styles.adminButton} src={removeFilmIcon} alt="" />
      )}
      {isHoveredAdmin && !wasWatched && (
        <Image className={styles.adminButton} src={addFilmIcon} alt="" />
      )}
      <section
        className={styles.watchedFilmsStats}
        style={wasWatched ? {} : { display: "none" }}
      >
        <p>
          {filmViews} <Image src={viewIcon} alt="icone visualização" />
        </p>
        <p>
          {filmRating} <Image src={estrelaIcon} alt="icone estrela" />
        </p>
      </section>
      <section
        className={styles.nextFilmsStats}
        style={wasWatched ? { display: "none" } : {}}
      >
        <Image src={likeIcon} alt="ícone like" />
        <p>{likes - dislikes}</p>
        <Image src={dislikeIcon} alt="ícone dislike" />
      </section>
    </div>
  );

  const addEvaluationBox = (
    <section className={styles.submitBox}>
      <div className={styles.submitBoxContent}>
        <Image
          src={closeIcon}
          alt="ícone sair"
          onClick={handleCloseSubmitBox}
          className={styles.submitBoxCloseButton}
        />
        {hasSubmited ? <h1>UPDATE EVALUATION</h1> : <h1>ADD EVALUATION</h1>}
        <section style={!hasSubmited ? { display: "none" } : {}}>
          <h2>CURRENT</h2>
          <EvaluationBox
            profilePic={profilePic}
            username={username}
            evaluation={currentEvaluation.comment}
            rating={currentEvaluation.rating}
            watchedOn={watchedOn}
          />
        </section>
        <section>
          <h2>PREVIEW</h2>
          <EvaluationBox
            profilePic={profilePic}
            username={username}
            evaluation={comment}
            rating={rating}
            watchedOn={watchedOn}
          />
        </section>
        {hasSubmited ? (
          <button onClick={handleUpdateComment}>UPDATE</button>
        ) : (
          <button onClick={handleAddComment}>ADD</button>
        )}
      </div>
    </section>
  );

  return (
    <>
      {card}
      {isExpanded &&
        !isAdmin &&
        ReactDOM.createPortal(
          <div className={styles.cardFilmExpanded}>
            <div className={styles.cardFilmContent}>
              <section className={styles.leftPart}>
                <Image
                  src={closeIcon}
                  alt="ícone sair"
                  onClick={handleClose}
                  className={styles.closeButton}
                />
                <Image
                  src={cardImage === "N/A" ? NA : cardImage}
                  width={300}
                  height={445}
                  alt={filmTitle + " foto de capa"}
                  className={styles.cardImg}
                  priority
                />
              </section>
              <section className={styles.filmStats}>
                <div className={styles.headerStats}>
                  <h1>{filmTitle}</h1>
                  <section className={styles.ratingStats}>
                    <p style={wasWatched ? {} : { display: "none" }}>
                      {filmViews}{" "}
                      <Image src={viewIcon} alt="icone vizualizção" />
                    </p>
                    <p style={wasWatched ? {} : { display: "none" }}>
                      {filmRating}{" "}
                      <Image src={estrelaIcon} alt="icone estrela" />
                    </p>
                    <p>
                      {likes}{" "}
                      <Image
                        onClick={handleLike}
                        style={
                          hasLiked
                            ? {
                                transform: "scale(1.4)",
                              }
                            : {}
                        }
                        className={styles.likeIcon}
                        src={likeIcon}
                        alt="ícone like"
                      />
                    </p>
                    <p>
                      {dislikes}{" "}
                      <Image
                        onClick={handleDislike}
                        className={styles.dislikeIcon}
                        style={
                          hasDisliked
                            ? {
                                transform: "scale(1.4)",
                              }
                            : {}
                        }
                        src={dislikeIcon}
                        alt="ícone dislike"
                      />
                    </p>
                  </section>
                </div>
                <p className={styles.detailedInformation}>
                  {filmYear}・{filmGenres}
                </p>
                <p className={styles.description}>{filmDescription}</p>
                <section
                  className={styles.evaluations}
                  style={wasWatched ? {} : { display: "none" }}
                >
                  <section className={styles.evaluationsHeader}>
                    <h2>EVALUATIONS</h2>
                    <p>{evaluations.length} PEOPLE</p>
                  </section>
                  <section className={styles.evaluationsContent}>
                    {evaluations.map((evaluation, index) => (
                      <EvaluationBox
                        key={index}
                        profilePic={evaluation.profilePic}
                        username={evaluation.username}
                        evaluation={evaluation.evaluation}
                        rating={evaluation.rating}
                        watchedOn={evaluation.watchedOn}
                      />
                    ))}
                  </section>
                  <form className={styles.postEvaluation}>
                    <textarea
                      required
                      name="evaluation"
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Tell us your opinion..."
                      maxLength={140}
                    ></textarea>
                    <div className={styles.evaluationDetails}>
                      <p>WATCHED ON:</p>
                      <select
                        name="selectWatchedOn"
                        id="selectWatchedOn"
                        onClick={handleSelect}
                      >
                        <option value="0">NETFLIX</option>
                        <option value="1">AMAZON</option>
                        <option value="2">HBO</option>
                        <option value="3">DISNEY</option>
                        <option value="4">STAR PLUS</option>
                        <option value="5">CLARO</option>
                        <option value="6">PIRATEX</option>
                      </select>
                      <div>
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            onMouseEnter={() => setHover(index + 1)}
                            onMouseLeave={() =>
                              isFilled ? setHover(rating) : setHover(0)
                            }
                            onClick={() => handleRatingClick(index + 1)}
                          >
                            {hover >= index + 1 ? (
                              <Image src={fullStar} alt="" />
                            ) : (
                              <Image src={emptyStar} alt="" />
                            )}
                          </span>
                        ))}
                      </div>
                      <button onClick={handleSubmmitEvaluation}>
                        EVALUATE
                      </button>
                    </div>
                  </form>
                </section>
              </section>
            </div>
          </div>,
          document.body
        )}
      {isEvaluationBoxExpanded && addEvaluationBox}
    </>
  );
}
