import Image from "next/image";
import logoPetflix from "@/assets/LOGOPETFLIX.svg";
import styles from "@/styles/components/PromotionalPanel.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "@/services/api";

export function PromotionalPanel() {
  const [quote, setQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    const fet = async () => {
      const response = await api.get("/api/quote");
      setQuote(response.data);
    };

    fet();
  }, []);

  return (
    <div className={styles.main}>
      <section className={styles.head}>
        <Image src={logoPetflix} id={styles.petflix} />

        <div id={styles.separator}></div>

        <div id={styles.logoText}>LOGIN</div>
      </section>

      <section className={styles.panel}>
        <div id={styles.video}></div>
      </section>

      <section className={styles.phrase}>
        <div id={styles.effectPhrase}>“{quote.quote}“</div>
        <div id={styles.author}>{quote.author.toUpperCase()}</div>
      </section>
    </div>
  );
}
