import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import ctfLinks from "~/data/ctf-links.json";
import { useSession } from "next-auth/react";
import { prisma } from "~/server/db";

const Home: NextPage = () => {
  const session = useSession();
  const names = api.flag.getNames.useQuery();
  const checkFlagMutation = api.flag.checkFlag.useMutation();
  const participantData = api.participants.getData.useQuery();

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
          <Link href="/check">
            <button className="rounded-md bg-gray-200 p-2 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]">
              Check answers
            </button>
          </Link>
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
          <div className="flex gap-10">
            <div className="flex h-fit flex-col gap-2 rounded-md border-[1px] border-gray-400 p-4">
              <h1 className="text-xl">Ctf Links</h1>
              {ctfLinks.map((link, index) => (
                <Link
                  href={link.link}
                  key={`link-${index}`}
                  className="text-blue-800 duration-75 hover:text-blue-500"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex h-fit flex-col gap-2 rounded-md border-[1px] border-gray-400 p-4">
              <h1 className="text-xl">Check</h1>
              <div className="flex gap-2">
                <select
                  className="cursor-pointer rounded-md bg-gray-200 p-2 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
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
                  className="rounded-md border-2 border-gray-500 p-1 shadow-black duration-150 focus:shadow-md"
                  placeholder="Enter flag"
                  value={flagValue}
                  onChange={changeFlagValue}
                />
                <button
                  className="rounded-md bg-gray-200 p-2 shadow-black duration-150 hover:shadow-md active:translate-y-[2px]"
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
