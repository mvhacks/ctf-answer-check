import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();
  const names = api.ctfs.getNames.useQuery();
  const checkFlagMutation = api.ctfs.checkFlag.useMutation();
  const participantData = api.participants.getData.useQuery();
  const userIsAdmin = api.user.isAdmin.useQuery();
  const links = api.ctfs.getLinks.useQuery();

  type AnswerState = "Correct" | "Incorrect" | null;
  const [currentChallengeName, setCurrentChallengeName] = useState<
    string | "_"
  >("_");
  const [currentAnswer, setCurrentAnswer] = useState<AnswerState>(null);
  const [flagValue, setFlagValue] = useState("");
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (participantData.data) {
      setUserPoints(participantData.data.points);
    }
  }, [participantData.data]);

  const checkFlag = async () => {
    const [correct, points] = await checkFlagMutation.mutateAsync({
      name: currentChallengeName,
      value: flagValue,
    });
    if (correct === true) {
      setCurrentAnswer("Correct");
      setUserPoints((prev) => prev + points);
    } else if (correct === false) {
      setCurrentAnswer("Incorrect");
    } else {
      setCurrentAnswer(null);
    }
  };

  const changeChallenge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setCurrentChallengeName(value);
  };

  const changeFlagValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setFlagValue(value);
  };

  return (
    <>
      <Head>
        <title>Check answers for ctfs</title>
        <meta name="description" content="Check answers for ctfs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col">
        <header className="flex w-full items-center justify-between bg-cyan-500 bg-opacity-75 p-4">
          <h1 className="text-xl">Ctf Answer Check</h1>
          <div className="flex gap-2">
            {session.data !== null ? (
              <button
                className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
                onClick={() => void signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
                onClick={() => void signIn()}
              >
                Sign In
              </button>
            )}
            {userIsAdmin.data && (
              <>
                <Link href="/admins">
                  <button className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]">
                    Edit Admins
                  </button>
                </Link>
                <Link href="/leaderboard">
                  <button className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]">
                    Leaderboard
                  </button>
                </Link>
                <Link href="/edit-ctfs">
                  <button className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]">
                    Edit Ctfs
                  </button>
                </Link>
              </>
            )}
          </div>
        </header>
        <section className="flex h-full w-full flex-col items-center justify-start gap-10 pt-12">
          <div>
            <h1 className="text-xl">
              {session.data?.user.name
                ? `Signed in as ${session.data?.user.name}`
                : "Not signed in"}
            </h1>
            <p>Points: {userPoints}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex h-fit min-w-[300px] flex-col gap-2 rounded-md border-[1px] border-gray-400 p-4">
              <h1 className="text-xl">Ctf Links</h1>
              {links.data &&
                links.data.map((link, index) => (
                  <Link
                    href={link.link}
                    key={`link-${index}`}
                    className="text-blue-800 duration-75 hover:text-blue-500"
                  >
                    ({link.points}) {link.name}
                  </Link>
                ))}
            </div>
            <div className="flex h-fit flex-col gap-2 rounded-md border-[1px] border-gray-400 p-4">
              <h1 className="text-xl">Check</h1>
              <div className="flex gap-2">
                <select
                  className="cursor-pointer rounded-md bg-gray-100 p-2 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
                  value={currentChallengeName}
                  onChange={changeChallenge}
                >
                  <option value="_">Choose a challenge</option>
                  {names.data &&
                    names.data.map((name, index) => (
                      <option value={name} key={`option-${index}`}>
                        {name}
                      </option>
                    ))}
                </select>
                <input
                  className="flex-1 rounded-md border-[1.5px] border-gray-200 p-1 outline-none duration-150 focus:border-gray-400"
                  placeholder="Enter flag"
                  value={flagValue}
                  onChange={changeFlagValue}
                />
                <button
                  className="rounded-md bg-gray-100 px-3 py-1 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
                  onClick={() => void checkFlag()}
                >
                  Check
                </button>
              </div>
              {currentAnswer !== null && (
                <div className="text-lg">{currentAnswer}</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
