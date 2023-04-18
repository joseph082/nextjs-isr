import { useSession, signIn, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button
          onClick={() => signOut()}
          className="bg-blue-400 rounded px-5 hover:bg-blue-700"
          type="button"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      {/* Not signed in <br />
      <button onClick={() => signIn()} className="bg-blue-400 rounded px-5 hover:bg-blue-700">
        Sign in
      </button> */}
      Loading...
    </div>
  );
}
