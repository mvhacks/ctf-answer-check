import { type GetServerSidePropsContext, type NextPage } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import EditCtfs from "~/components/EditCtfs";
import { authOptions } from "~/server/auth";
import { isAdmin } from "~/utils/admin";

const Home: NextPage = () => {
  return (
    <main className="h-screen">
      <header className="flex w-full items-center justify-between bg-cyan-500 bg-opacity-75 p-4">
        <h1 className="text-lg">Edit Ctfs</h1>
        <Link href="/">
          <button className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]">
            Home
          </button>
        </Link>
      </header>
      <section className="flex w-full flex-col items-center gap-4 pt-8">
        <EditCtfs />
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
