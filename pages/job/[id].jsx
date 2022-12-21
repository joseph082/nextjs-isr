import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function Job(props) {
  // can destructure with function Job({})
  // props is the props object returned by getStaticProps

  const { title, description, created, posters } = props.job;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  return (
    <ul>
      <li>Job Title: {title}</li>
      <li>Description: {description}</li>
      <li>Date Posted: {new Date(created).toDateString()}</li>
      <li>Professors/Researchers: {JSON.stringify(posters)}</li>
    </ul>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in

export async function getStaticProps(context) {
  // console.log('getStaticProps');
  // console.log({ context });

  // Can see how the object is formatted. It's based off of the schema
  // console.log('All Jobs', await prisma.job.findMany());
  // console.log('First Job', await prisma.job.findFirst());

  const specificJob = await prisma.job.findUnique({
    where: { id: parseInt(context.params.id, 10) }, // database expects an integer
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
  // console.log(JSON.stringify({ specificJob }, null, 2));
  // {
  //   "specificJob": {
  //     "id": 1,
  //     "created": "2022-12-19T05:59:31.761Z",
  //     "closingDate": null,
  //     "closed": false,
  //     "title": "research title",
  //     "description": "description",
  //     "labId": "randomID",
  //     "posters": [
  //       {
  //         "firstName": "first",
  //         "lastName": "last",
  //         "email": "firslast@ucla.edu"
  //       }
  //     ],
  //     "lab": {
  //       "name": "lab1",
  //       "slug": "lab-1"
  //     }
  //   }
  // }

  // specificJob.created = JSON.parse(JSON.stringify(specificJob.created)); // converts this from a Date to a String
  // https://stackoverflow.com/questions/70449092/reason-object-object-date-cannot-be-serialized-as-json-please-only-ret

  // specificJob.created = JSON.stringify(specificJob.created);
  // specificJob.created = specificJob.created.substring(1, specificJob.created.length - 1);

  return {
    props: {
      job: { ...specificJob, created: JSON.parse(JSON.stringify(specificJob.created)) },
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

  // prisma.table.function();
  const jobs = await prisma.job.findMany({
    select: { id: true },
  });

  // Get the paths we want to pre-render based on jobs
  const paths = jobs.map((job) => ({
    params: { id: job.id.toString(10) }, // id needs to be a string
    // The key inside params object must match the file/page name. if file is [pid].jsx,
    // the params object should be { pid: '1' }

    // requery database in getStaticProps because can't keep result without storing in FS
    // params: { id: job.id.toString(10), job }, https://github.com/vercel/next.js/discussions/11272
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false };
}

export default Job;
