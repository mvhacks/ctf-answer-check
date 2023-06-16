import { type stylesType } from "~/types/styles";

export const styles: stylesType = {
  button: "duration-200 hover:scale-105 active:translate-y-[2px]",
  providerStyles: {
    google: {
      logo: "/google.svg",
      logoDark: "/google.svg",
      bgDark: "#fff",
      bg: "#fff",
      text: "#000",
      textDark: "#000",
    },
  },
  msgStyles: [
    "bg-gradient-to-br from-green-300 to-blue-300",
    "bg-gradient-to-br from-yellow-300 to-white",
    "bg-gradient-to-br from-purple-400 to-purple-200",
  ],
};
