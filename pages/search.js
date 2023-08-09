import styles from "@/styles/pages/Home.module.css";

import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilmCard } from "@/components/FilmCard";
import { NextPageButton } from "@/components/nextPageButton";

import { api } from "@/services/api";
import { useState } from "react";

function Search({
  results,
  query,
  totalResults,
  authorization,
  isAdmin,
  profilePic,
}) {
  if (totalResults != 0) {
    const [page, setPage] = useState(1);
    const [foundMovies, setFoundMovies] = useState(results);
    const amountPages = Math.ceil(totalResults / 10);

    const onClickHandle = async () => {
      if (page + 1 <= amountPages) {
        const [foundMovies2, totalResults2] = await requestSearchMovie(
          authorization,
          query,
          page + 1
        );
        const foundMovies1 = foundMovies.concat(foundMovies2);

        setPage(page + 1);
        setFoundMovies(foundMovies1);
      }
    };

    return (
      <div className={styles.search}>
        <Header isAdmin={isAdmin} profilePic={profilePic} />
        <div className={styles.searchMain}>
          <div className={styles.foundFilmsContainer}>
            <section className={styles.foundFilmsText}>
              <p>MOVIES/TV SERIES FOUND FOR "{query}"</p>
              <p className={styles.qtdFoundFilmsText}>{totalResults} RESULTS</p>
            </section>
            <section className={styles.foundFilms}>
              {foundMovies.map((film, index) => {
                return (
                  <FilmCard
                    key={index}
                    authorization={authorization}
                    wasWatched={film.wasWatched}
                    cardImage={film.poster}
                    imdbId={film.imdbId}
                    filmViews={film.evaluations}
                    filmRating={film.rating}
                    filmLikes={film.likes}
                    filmDislikes={film.dislikes}
                    isAdmin={isAdmin}
                  />
                );
              })}
              <div>
                <NextPageButton onClick={onClickHandle} />
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className={styles.search}>
      <Header isAdmin={isAdmin} profilePic={profilePic} />
      <div className={styles.notFoundMain}>
        <Image
          src="/notFound.png"
          alt="not found image"
          width={261}
          height={240}
        />
        <p className={styles.foundFilmsText}>
          NO MOVIE/TV SERIES NAMED “{query}” WAS FOUND
        </p>
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
  const query = context.query.query;

  if (query == undefined) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  const [movies, totalResults] = await requestSearchMovie(
    authorization,
    query,
    1
  );

  console.log(movies);

  return {
    props: {
      results: movies,
      query,
      totalResults,
      authorization,
      isAdmin,
      profilePic,
    },
  };
}

const requestSearchMovie = async (authorization, query, page) => {
  let movies = [];
  let totalResults = 0;

  let response;
  try {
    const data = {
      page: page,
      query: query,
    };

    response = await api.post("/api/search", data, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    movies = response.data.movies;
    totalResults = response.data.totalResults;
  } catch (err) {
    console.log(err);
  }
  return [movies, totalResults];
};

export default Search;
