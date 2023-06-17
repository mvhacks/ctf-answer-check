import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { authOptions } from "~/server/auth";
import Image from "next/image";
import { styles } from "~/utils/styles";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const logoUrl = "https://authjs.dev/img/providers/";
  return (
    <main className="bg-background flex min-h-screen w-full flex-col items-center gap-24 pt-44">
      <h1 className="text-3xl">MVHacks CTFs</h1>
      <div className="flex h-full w-full justify-center">
        <section className="bg-primary flex min-w-[350px] flex-col items-center gap-2 rounded-md border-[1px] border-gray-200 bg-opacity-5 p-10 pt-6">
          <h1 className="mb-2 text-2xl">Sign In</h1>
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="h-fit">
              <button
                onClick={() => void signIn(provider.id)}
                className="text-md flex flex-row items-center gap-4 rounded-md border-[1px] border-solid border-gray-200 pb-3 pl-5 pr-5 pt-3 uppercase duration-150 hover:scale-110 hover:border-white hover:shadow-lg"
                style={{
                  background:
                    styles.providerStyles[provider.id]?.bgDark || "#ffffff",
                  color:
                    styles.providerStyles[provider.id]?.textDark || "#000000",
                }}
              >
                {styles.providerStyles[provider.id] && (
                  <Image
                    src={`${logoUrl}${
                      styles.providerStyles[provider.id]?.logoDark as string
                    }`}
                    alt=""
                    height="20"
                    width="20"
                  />
                )}
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
