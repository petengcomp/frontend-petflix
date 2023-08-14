import styles from "@/styles/pages/MyMovies.module.css";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilmCard } from "@/components/FilmCard";
import { EvaluationCard } from "@/components/EvaluationCard";

import exampleImg from "@/assets/exampleImg.png";
import { api } from "@/services/api";

function Movies({
  likedMovies,
  evaluationsMovies,
  isAdmin,
  authorization,
  profilePic,
}) {
  let movies = [];
  const [sortType, setSortType] = useState("MOST FREQUENT");

  //for (let i = 0; i < 10; i++) {
  //  movies.push({
  //    wasWatched: true,
  //    imdbId: 123,
  //    cardImage: exampleImg,
  //    filmViews: 7,
  //    filmRating: 3.2,
  //    filmLikes: 7,
  //    filmDislikes: 2,
  //  });
  //}

  const handleRankByMostFrequent = () => {
    evaluationsMovies.sort((a, b) => {
      return b.evaluations.length - a.evaluations.length;
    }
    );
  };

  const handleRankByHighestRating = () => {
    console.log(evaluationsMovies)
    evaluationsMovies.sort((a, b) => {
      return b.rating - a.rating;
    }
    );
  };

  return (
    <div className={styles.moviesPage}>
      <Header isAdmin={isAdmin} profilePic={profilePic} />

      <div className={styles.main}>
        <div className={styles.foundFilmsContainer}>
          <section className={styles.foundFilmsText}>
            <p>MY LIKED MOVIES</p>
            <p className={styles.qtdFoundFilmsText}>
              {likedMovies.length} FILMS/SERIES
            </p>
          </section>
          <section className={styles.foundFilms}>
            {likedMovies.map((film, index) => {
              return (
                <FilmCard
                  key={index}
                  wasWatched={film.wasWatched}
                  cardImage={film.poster}
                  imdbId={film.imdbId}
                  filmViews={film.evaluations}
                  filmRating={film.rating.toFixed(2)}
                  filmLikes={film.likes}
                  filmDislikes={film.dislikes}
                  authorization={authorization}
                  isAdmin={isAdmin}
                />
              );
            })}
          </section>
        </div>
        <div className={styles.foundFilmsContainer}>
          <section className={styles.foundFilmsText}>
            <p>MY EVALUATIONS</p>
            <p className={styles.qtdFoundFilmsText}>
              {evaluationsMovies.length} EVALUATIONS
            </p>
            <p className={styles.rankByText} onClick={()=>{
              if(sortType == "MOST FREQUENT"){ 
                setSortType("highestRating")
                handleRankByHighestRating()
                setSortType("HIGHTEST RATING")
              }
              else {
                setSortType("mostFrequent")
                handleRankByMostFrequent()
                setSortType("MOST FREQUENT")
              }
              }}>
              RANK BY <strong>{sortType}</strong>
            </p>
          </section>
          <section className={styles.foundFilms}>
            {evaluationsMovies.map((film, index) => {
              return (
                <EvaluationCard
                  key={index}
                  wasWatched={true}
                  cardImage={film.poster}
                  imdbId={film.imdbId}
                  filmViews={film.evaluations.length}
                  filmRating={film.rating.toFixed(2)}
                  filmLikes={film._count.likes}
                  filmDislikes={film._count.dislikes}
                  authorization={authorization}
                  userRating={film.userRating}
                  watchedOn={film.whatchedOn}
                />
              );
            })}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export async function getServerSideProps(context) {
  const authorization = context.req.cookies["petflix_token"];
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

  const isAdmin = response.data.user.role === "ADMIN";
  const profilePic =
    "http://api-petflix.pet.inf.ufes.br/public/avatar/" +
    response.data.user.profilePic +
    ".png";

  const likedMovies = response.data.likedMovies;
  const em = response.data.evaluations;
  const evaluationsMovies = [];

  for (let i = 0; i < em.length; i++) {
    const movie = await getMovie(em[i].imdbId, authorization);
    movie.userRating = em[i].rating;
    movie.whatchedOn = em[i].stream;
    evaluationsMovies.push(movie);
  }

  return {
    props: {
      likedMovies,
      evaluationsMovies,
      isAdmin,
      authorization,
      profilePic,
    },
  };
}

const getMovie = async (imdbId, authorization) => {
  let response;

  try {
    response = await api.get(`/api/movie?imdbId=${imdbId}`, {
      headers: {
        Authorization: authorization,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return response.data;
};

export default Movies;
