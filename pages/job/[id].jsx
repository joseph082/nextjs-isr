import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function Job(props) {
  // props is the props object returned by getStaticProps

  const { title, description, created, posters } = props.job;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

  return (
    <ul>
      <li>Job Title: {title}</li>
      <li>Description: {description}</li>
      <li>Date Created: {new Date(created).toDateString()}</li>
      <li>Professors/Researchers: {JSON.stringify(posters.null, 2)}</li>
    </ul>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in

export async function getStaticProps(context) {
  // console.log('getStaticProps');
  // console.log({ context });

  const { id } = context.params;
  const specificJob = await prisma.job.findUnique({
    where: { id: parseInt(id, 10) }, // database expects an integer
    include: {
      posters: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      lab: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  // console.log({ specificJob });
  specificJob.created = JSON.stringify(specificJob.created);
  specificJob.created = specificJob.created.substring(1, specificJob.created.length - 1);

  return {
    props: {
      job: specificJob,
    },

    // // Next.js will attempt to re-generate the page:
    // // - When a request comes in
    // // - At most once every 10 seconds
    // revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  // console.log('getStaticPaths');
  const jobs = await prisma.job.findMany({
    select: { id: true },
  });

  // Get the paths we want to pre-render based on jobs
  const paths = jobs.map((job) => ({
    params: { id: job.id.toString(10) }, // id needs to be a string
    // The key inside params object must match the file/page name. if file is [pid].jsx,
    // the params object should be { pid: '1' }

    // params: { id: job.id.toString(10), job }, https://github.com/vercel/next.js/discussions/11272
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false };
}

export default Job;
