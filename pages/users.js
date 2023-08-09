import styles from "@/styles/pages/Users.module.css";

import { useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserBox } from "@/components/UserBox";

import exempleProfilePic from "@/assets/exempleProfilePic.png";
import { api } from "@/services/api";

export default function Users({ users, register }) {
  const [isRegisteringAllowed, setIsRegisteringAllowed] = useState(register); // pegar do banco de dados

  const handleRegisteringAllowed = () => {
    setIsRegisteringAllowed(!isRegisteringAllowed);
    api.put("/api/admin/registertoggle");
  };

  return (
    <div className={styles.users}>
      <Header />
      <div className={styles.usersContent}>
        <div className={styles.usersConteiner}>
          <section className={styles.usersConteinerText}>
            <span>
              <p>REGISTERED USERS</p>
              <p id={styles.qtdUsers}>0 USERS</p>
            </span>
            <span>
              {isRegisteringAllowed ? (
                <p>REGISTERING ALLOWED</p>
              ) : (
                <p>REGISTERING NOT ALLOWED</p>
              )}
              <p id={styles.changeBtn} onClick={handleRegisteringAllowed}>
                CHANGE
              </p>
            </span>
          </section>
          <section className={styles.usersConteinerContent}>
            {users.map((user, index) => {
              return (
                <UserBox
                  key={index}
                  evaluations={user.evaluations}
                  profilePic={exempleProfilePic}
                  qtdEvaluations={user.evaluations.length}
                  registrationYear={new Date(user.createdAt).getFullYear()}
                  username={user.name}
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
    response = await api.get("/api/admin/users", {
      headers: {
        Authorization: authorization,
      },
    });
    let register = await api.get("/api/admin/registerison", {
      headers: {
        Authorization: authorization,
      },
    });

    return {
      props: {
        users: response.data,
        register: register.data.registerIsOn,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
}
