import styles from '../styles/Home.module.css';
import LoginButton from '../components/login-btn';

export default function Home(props) {
  return (
    <div className={styles.container}>
      <LoginButton></LoginButton>
      {props.buildDate}
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      buildDate: new Date().toString(), // will be passed to the page component as props
    },
  };
}
