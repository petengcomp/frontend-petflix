import styles from "@/styles/pages/Login.module.css";

import { LoginBox } from "@/components/LoginBox";
import { PromotionalPanel } from "@/components/PromotionalPanel";
import { api } from "@/services/api";

function Login() {
  return (
    <div className={styles.main}>
      <PromotionalPanel />
      <LoginBox />
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
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
}

export default Login;
