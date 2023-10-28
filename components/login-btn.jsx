import { useSession, signOut } from 'next-auth/react';

export default function Component() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? `Signed in as ${session.user.email}` : 'Loading...'}
      <br />
      <button
        onClick={() => signOut()}
        className={`bg-blue-400 rounded px-5 hover:bg-blue-700${
          !session ? ' aria-hidden invisible' : ''
        }`}
        type="button"
      >
        Sign out
      </button>
    </div>
  );
}
