import styles from "@/styles/pages/Rank.module.css"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useEffect } from "react"
import { api } from "@/services/api"

function Ranking({bestMovies, usersWithMoreEvaluations, profilePic, isAdmin, authorization}) {
    return (
        <div className={styles.rank}>
            <Header isAdmin={isAdmin} profilePic={profilePic} />
            <div className={styles.rankContent}>
                <div className={styles.rankContainer}>
                    <section className={styles.rankContainerText}>
                        <span>
                            <p>USERS WITH MORE EVALUATIONS</p>
                        </span>
                    </section>
                    {
                        usersWithMoreEvaluations.map((user, index) => {
                            return (


                                <section className={styles.rankContainerText} key={index}>
                                    <span>
                                        <p>#{index+1}</p>
                                    </span>
                                    <span>
                                        <p>{user.name}</p>
                                    </span>
                                    <span>
                                        <p>{user.total} EVALUATIONS</p>
                                    </span>
                                </section>

                            )
                        })
                    }
                </div>

                <div className={styles.rankContainer}>
                    <section className={styles.rankContainerText}>
                        <span>
                            <p>BEST MOVIES/ TV SERIES</p>
                        </span>
                    </section>

                    {
                        bestMovies.map((movie, index) => {
                            return (

                                <section className={styles.rankContainerText} key={index}>
                                    <span>
                                        <p>#{index+1}</p>
                                    </span>
                                    <span>
                                        <p>{movie.title}</p>
                                    </span>
                                    <span>
                                        <p>{movie.rating}</p>
                                    </span>
                                </section>

                            )
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const authorization = context.req.cookies["petflix_token"]

    try {
        let response = await api.get("/api/user", {
            headers: {
              Authorization: authorization,
            },
          });
        let bestMovies = await api.get("/api/ranking/bestmovies", {
            headers: {
                Authorization: authorization,
            },
        })

        let usersWithMoreEvaluations = await api.get("/api/ranking/mostevaluations", {
            headers: {
                Authorization: authorization
            }
        })

        const isAdmin = response.data.user.role === "ADMIN";
        const profilePic =
            "http://api-petflix.pet.inf.ufes.br/public/avatar/" +
            response.data.user.profilePic +
            ".png";

        return {
            props: {
                bestMovies: bestMovies.data,
                usersWithMoreEvaluations: usersWithMoreEvaluations.data,
                profilePic,
                isAdmin,
            }
        }
    } catch (err) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        }
    }

}

export default Ranking
