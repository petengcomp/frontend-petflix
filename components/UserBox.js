import styles from "@/styles/components/UserBox.module.css";

import Image from "next/image";
import { useState } from "react";

import { UsersEvaluationBox } from "./UsersEvaluationBox";

import exampleImage from "@/assets/exampleImg.png";

import { BsFillTrashFill } from "react-icons/bs";
import closeIcon from "@/assets/closeIcon.png";

export function UserBox({
  username,
  registrationYear,
  qtdEvaluations,
  profilePic,
  evaluations,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    // pegar comentarios via api
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      <div className={styles.userBox} onClick={handleClick}>
        <Image src={profilePic} alt={username + " profile pic"} />
        <section className={styles.content}>
          <h3>{username}</h3>
          <p>YEAR OF REGISTRATION: {registrationYear}</p>
          <p>EVALUATIONS: {qtdEvaluations}</p>
        </section>
        <BsFillTrashFill className={styles.icon} />
      </div>
      {isExpanded && (
        <div className={styles.userEvaluationsBox}>
          <div className={styles.userEvaluationsBoxContent}>
            <Image
              src={closeIcon}
              alt="ícone sair"
              onClick={handleClose}
              className={styles.closeButton}
            />
            <h2>USER&#39;S EVALUATIONS</h2>
            <h3 className={styles.username}>{username}</h3>
            <section className={styles.evaluations}>
              {evaluations.map((evaluation, index) => {
                return (
                  <UsersEvaluationBox
                    key={index}
                    filmPic={exampleImage}
                    filmName="GATO DE BOTAS"
                    evaluation="Coe viajaram nesse dai."
                    rating={3}
                    watchedOn="3"
                  />
                );
              })}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
