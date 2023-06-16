import { type GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ParticipantLeaderboard from "~/components/ParticipantLeaderboard";
import { authOptions } from "~/server/auth";
import { isAdmin } from "~/utils/admin";

const Home: NextPage = () => {
  return (
    <main className="h-screen">
      <header className="flex w-full items-center justify-between bg-cyan-500 bg-opacity-75 p-4">
        <h1 className="text-lg">Leaderboard</h1>
        <Link href="/">
          <button className="rounded-md bg-gray-200 p-2 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]">
            Home
          </button>
        </Link>
      </header>
      <section className="flex w-full justify-center pt-8">
        <ParticipantLeaderboard />
      </section>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const userIsAdmin = await isAdmin(session);

  if (!userIsAdmin) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
}

export default Home;
