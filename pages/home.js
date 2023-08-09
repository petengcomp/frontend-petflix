import styles from "@/styles/pages/Home.module.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilmCard } from "@/components/FilmCard";

import { api } from "@/services/api";

function Home({ nextFilms, watchedFilms, isAdmin, authorization, profilePic }) {
  return (
    <div className={styles.home}>
      <Header isAdmin={isAdmin} profilePic={profilePic} />
      <div className={styles.homeMain}>
        <div className={styles.watchedFilmsContainer}>
          <section className={styles.watchedFilmsText}>
            <p>WATCHED FILMS</p>
            <p className={styles.qtdWatchedFilmsText}>
              {watchedFilms.length} MOVIES/TV SERIES
            </p>
          </section>
          <section className={styles.watchedFilms}>
            {watchedFilms.map((film, index) => {
              return (
                <FilmCard
                  key={index}
                  authorization={authorization}
                  wasWatched={film.wasWatched}
                  cardImage={film.poster}
                  imdbId={film.imdbId}
                  filmViews={film.evaluations}
                  filmRating={film.rating.toFixed(2)}
                  filmLikes={film.likes}
                  filmDislikes={film.dislikes}
                  isAdmin={isAdmin}
                />
              );
            })}
          </section>
        </div>
        <div className={styles.nextFilmsContainer}>
          <section className={styles.nextFilmsText}>
            <p>SUGGESTED FILMS</p>
            <p className={styles.qtdNextFilmsText}>
              {nextFilms.length} MOVIES/TV SERIES
            </p>
          </section>
          <section className={styles.nextFilms}>
            {nextFilms.map((film, index) => {
              return (
                <FilmCard
                  key={index}
                  authorization={authorization}
                  wasWatched={film.wasWatched}
                  cardImage={film.poster}
                  imdbId={film.imdbId}
                  filmViews={film.evaluations}
                  filmRating={film.rating.toFixed(2)}
                  filmLikes={film.likes}
                  filmDislikes={film.dislikes}
                  isAdmin={isAdmin}
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
  const nextFilms = await requestSuggestedMovies(authorization);
  const watchedFilms = await requestWatchedMovies(authorization);

  return {
    props: {
      nextFilms,
      watchedFilms,
      isAdmin,
      authorization,
      profilePic,
    },
  };
}

const requestWatchedMovies = async (authorization) => {
  let response;

  try {
    response = await api.get("/api/movie/watched", {
      headers: {
        Authorization: authorization,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return response.data;
};
const requestSuggestedMovies = async (authorization) => {
  let response;

  try {
    response = await api.get("/api/movie/suggested", {
      headers: {
        Authorization: authorization,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return response.data;
};

export default Home;
