import styles from '@/styles/pages/Home.module.css'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FilmCard } from '@/components/FilmCard'

import exampleImg from '@/assets/exampleImg.png'

function Home({nextFilms, watchedFilms}){


    return (
        <div className={styles.home}>
            <Header />
            <div className={styles.homeMain}>
                <div className={styles.watchedFilmsContainer}>
                    <section className={styles.watchedFilmsText}>
                        <p>LAST FILMS</p>
                        <p className={styles.qtdWatchedFilmsText}>{watchedFilms.length} FILMS/SERIES</p>
                    </section>
                    <section className={styles.watchedFilms}>
                        {watchedFilms.map((film, index) => {
                            return (
                                <FilmCard
                                    key={index}
                                    cardImage={film.cardImage}
                                    filmViews={film.filmViews}
                                    filmRating={film.filmRating}
                                    filmTitle={film.filmTitle}
                                    filmLikes={film.filmLikes}
                                    filmDislikes={film.filmDislikes}
                                    filmDescription={film.filmDescription}
                                    filmGenres={film.filmGenres}
                                    filmYear={film.filmYear}
                                    wasWatched={true}
                                />
                            )
                        })}
                    </section>
                </div>
                <div className={styles.nextFilmsContainer}>
                    <section className={styles.nextFilmsText}>
                        <p>NEXT FILMS</p>
                        <p className={styles.qtdNextFilmsText}>{nextFilms.length} FILMS/SERIES</p>
                    </section>
                    <section className={styles.nextFilms}>
                        {nextFilms.map((film, index) => {
                            return (
                                <FilmCard
                                    key={index}
                                    cardImage={film.cardImage}
                                    filmViews={film.filmViews}
                                    filmRating={film.filmRating}
                                    filmTitle={film.filmTitle}
                                    filmLikes={film.filmLikes}
                                    filmDislikes={film.filmDislikes}
                                    filmDescription={film.filmDescription}
                                    wasWatched={false}
                                />
                            )
                        })}
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps() {
    // pegar dados do backend
    const nextFilms = [{cardImage: exampleImg, filmViews: 7, filmRating: 3.2, filmTitle: "PUSS IN BOOTS 2", filmLikes: 7, filmDislikes: 2, filmDescription: "Em Peaky Blinders, Thomas Shelby (Cillian Murphy) e seus irm??os retornam a Birmingham depois de servir no ex??rcito brit??nico durante a Primeira Guerra Mundial. Shelby e os Peaky Blinders, a gangue de criminosos da qual ele ?? l??der, controlam a cidade com m??os de ferro, construindo um imp??rio que vai desde corridas de cavalo adulteradas e roubo de carregamentos at?? parcerias secretas com os russos. Mas as ambi????es de Shelby se estendem para al??m de Birmingham, e ele n??o vai deixar que ningu??m atrapalhe seus planos de se tornar um dos homens mais poderosos do Reino Unido. ?? medida que sua fam??lia se destaca nos neg??cios, novas alian??as se formam, bem como novas e perigosas rivalidades. Ao mesmo tempo que vive as transforma????es pol??ticas, econ??micas e sociais do in??cio do s??culo 20, Shelby precisa lidar com os traumas de seu pr??prio passado - que parecem atorment??-lo diariamente."}];
    const watchedFilms = [{cardImage: exampleImg, filmViews: 7, filmRating: 3.2, filmTitle: "PUSS IN BOOTS 2", filmLikes: 7, filmDislikes: 2, filmDescription: "Em Peaky Blinders, Thomas Shelby (Cillian Murphy) e seus irm??os retornam a Birmingham depois de servir no ex??rcito brit??nico durante a Primeira Guerra Mundial. Shelby e os Peaky Blinders, a gangue de criminosos da qual ele ?? l??der, controlam a cidade com m??os de ferro, construindo um imp??rio que vai desde corridas de cavalo adulteradas e roubo de carregamentos at?? parcerias secretas com os russos. Mas as ambi????es de Shelby se estendem para al??m de Birmingham, e ele n??o vai deixar que ningu??m atrapalhe seus planos de se tornar um dos homens mais poderosos do Reino Unido. ?? medida que sua fam??lia se destaca nos neg??cios, novas alian??as se formam, bem como novas e perigosas rivalidades. Ao mesmo tempo que vive as transforma????es pol??ticas, econ??micas e sociais do in??cio do s??culo 20, Shelby precisa lidar com os traumas de seu pr??prio passado - que parecem atorment??-lo diariamente.", filmYear:2023, filmGenres:"Drama, Crime, Historical Fiction"}, {cardImage: exampleImg, filmViews: 5, filmRating: 1.2, filmTitle: "PEL??", filmLikes: 1, filmDislikes: 2}, {cardImage: exampleImg, filmViews: 7, filmRating: 3.2, filmTitle: "Pel??", filmLikes: 7, filmDislikes: 2}, {cardImage: exampleImg, filmViews: 5, filmRating: 1.2, filmTitle: "Pel??", filmLikes: 1, filmDislikes: 2}, {cardImage: exampleImg, filmViews: 7, filmRating: 3.2, filmTitle: "Pel??", filmLikes: 7, filmDislikes: 2}, {cardImage: exampleImg, filmViews: 5, filmRating: 1.2, filmTitle: "Pel??", filmLikes: 1, filmDislikes: 2}];
    return {
        props: {
            nextFilms,
            watchedFilms
        }
    }
}

export default Home