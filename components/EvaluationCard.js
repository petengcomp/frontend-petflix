import Image from "next/image";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import styles from "@/styles/components/EvaluationCard.module.css";
import { FilmCard } from "@/components/FilmCard";

import netflixIcon from "../assets/netflixIcon.png";
import primeVideoIcon from "../assets/primeVideoIcon.png";
import HBOMaxIcon from "../assets/HBOMaxIcon.png";
import disneyPlusIcon from "../assets/disneyPlusIcon.png";
import starPlusIcon from "../assets/starPlusIcon.png";
import claroTVIcon from "../assets/claroTVIcon.png";
import piratexIcon from "../assets/piratexIcon.png";
import fullStar from "@/assets/fullStar.png";
import emptyStar from "@/assets/emptyStar.png";

export function EvaluationCard({
  key,
  wasWatched,
  imdbId,
  cardImage,
  filmViews,
  filmRating,
  filmLikes,
  filmDislikes,
  userRating,
  watchedOn,
  authorization,
}) {
  let watchedOnComponent = null;
  switch (watchedOn) {
    case "NETFLIX":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          NETFLIX <Image src={netflixIcon} alt="netflix icon" />
        </p>
      );
      break;
    case "AMAZON":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          AMAZON <Image src={primeVideoIcon} alt="prime video icon" />
        </p>
      );
      break;
    case "HBO":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          HBO <Image src={HBOMaxIcon} alt="hbo max icon" />
        </p>
      );
      break;
    case "DISNEY":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          DISNEY <Image src={disneyPlusIcon} alt="disney plus icon" />
        </p>
      );
      break;
    case "STARPLUS":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          STAR PLUS <Image src={starPlusIcon} alt="star plus icon" />
        </p>
      );
      break;
    case "CLARO":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          CLARO <Image src={claroTVIcon} alt="claro tv icon" />
        </p>
      );
      break;
    case "PIRATEX":
      watchedOnComponent = (
        <p className={styles.watchedOnComponent}>
          PIRATEX <Image src={piratexIcon} alt="piratex icon" />
        </p>
      );
      break;
    default:
      break;
  }
  const [isFilled, setIsFilled] = useState(true);
  const [hover, setHover] = useState(userRating);
  const [rating, setRating] = useState(userRating);

  function handleRatingClick(value) {
    setRating(value);
    setHover(value);
    setIsFilled(true);
  }

  return (
    <div className={styles.evaluationCard}>
      <FilmCard
        key={key}
        wasWatched={wasWatched}
        cardImage={cardImage}
        imdbId={imdbId}
        filmViews={filmViews}
        filmRating={filmRating}
        filmLikes={filmLikes}
        filmDislikes={filmDislikes}
        authorization={authorization}
      />
      <div className={styles.userInfo}>
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {hover >= index + 1 ? (
              <Image src={fullStar} alt="" />
            ) : (
              <Image src={emptyStar} alt="" />
            )}
          </span>
        ))}
        <div className={styles.watchedOn}>
          <h5>WATCHED ON:</h5>
          {watchedOnComponent}
        </div>
      </div>
    </div>
  );
}
