import styles from "@/styles/pages/Signup.module.css";
import styleHeader from "../styles/components/Header.module.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignupForm } from "@/components/SignupForm";
import logoImg from "../assets/logo.png";

import Image from "next/image";

function Signup() {
  return (
    <div className={styles.signup}>
      <header className={styleHeader.header}>
        <Image src={logoImg} alt="logo do petflix" />
      </header>
      <div className={styles.main}>
        <h2 className={styles.title}>SIGN UP</h2>
        <SignupForm />
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
