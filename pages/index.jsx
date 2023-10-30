import styles from '../styles/Home.module.css';
import LoginButton from '../components/login-btn';
import { useState, useEffect, useRef } from 'react';

export default function Home(props) {
  const routes = [
    { path: '/api/supabase', label: 'East (supabase-js Lambda)' },
    { path: '/api/supabase-west', label: 'West (supabase-js Lambda)' },
    { path: '/api/supabase-edge', label: 'East (Edge)' },
    { path: '/api/supabase-edge-west', label: 'West (Edge)' },
    { path: '/api/prisma', label: 'West (Prisma Lambda)' },
  ];
  const [fetching, setFetching] = useState(new Array(routes.length).fill(false));
  const [fetchTimes, setFetchTimes] = useState([]);
  async function logFetch(index) {
    // console.log({ index });
    if (fetching[index]) {
      return;
    }
    // const newFetching = [...fetching];
    // newFetching[index] = true;
    // setFetching(newFetching);
    setFetching((f) => f.map((isFetching, i) => (i === index ? true : isFetching)));
    await fetch(routes[index].path);
    setFetching((f) => f.map((isFetching, i) => (i === index ? false : isFetching)));
  }
  const hostLength = props.host.length;
  const lastRowRef = useRef();

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry, index) => {
        console.log(entry);

        if (
          !entry.name.startsWith(`${props.host}/api/supabase`) &&
          entry.name !== `${props.host}/api/prisma`
        ) {
          return;
        }
        setFetchTimes((ft) => [
          ...ft,
          {
            duration: entry.duration,
            route: entry.name.substring(hostLength),
            key: `${entry.fetchStart},${index}`,
          },
        ]);
      });
    });

    observer.observe({ type: 'resource', buffered: false });
    for (const { path } of routes) {
      fetch(path);
    }
  }, []);

  useEffect(() => {
    lastRowRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [fetchTimes]);

  return (
    <div className={`${styles.container} flex flex-col gap-2`}>
      <LoginButton />
      <div>{props.buildDate}</div>
      <div className="flex gap-2">
        {routes.map((e, i) => {
          return (
            <button
              onClick={() => logFetch(i)}
              disabled={fetching[i]}
              className="bg-blue-400 rounded px-5 hover:bg-blue-700 disabled:opacity-75"
              key={e.path}
            >
              {e.label}
            </button>
          );
        })}
      </div>
      <div className="h-[75vh] overflow-y-scroll w-fit">
        <table>
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="w-52 sticky">Route</th> <th className="w-40">Duration (ms)</th>
            </tr>
          </thead>
          <tbody>
            {fetchTimes.map(({ route, duration }, i) => (
              <tr key={route} {...(i === fetchTimes.length - 1 && { ref: lastRowRef })}>
                <td>{route}</td> <td>{duration.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      host: process.env.NEXTAUTH_URL_INTERNAL,
      buildDate: new Date().toString(), // will be passed to the page component as props
    },
  };
}
