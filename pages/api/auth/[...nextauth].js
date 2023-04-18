import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account.provider === 'google') {
        // console.log({ profile }, 'signIn');
        const allowedEmails = process.env.ALLOWED_EMAILS.split(',');
        return (
          profile.email_verified &&
          (profile.email.endsWith('@ucla.edu') || profile.email.endsWith('.ucla.edu')) &&
          allowedEmails.includes(profile.email)
        );
      }
      return false; // Do different verification for other providers that don't have `email_verified`
    },
  },
};

export default NextAuth(authOptions);
