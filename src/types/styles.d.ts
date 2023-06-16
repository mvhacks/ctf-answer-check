import { type OAuthProviderButtonStyles } from "next-auth/providers";

export declare type stylesType = {
  button: string;
  providerStyles: {
    [key: string]: OAuthProviderButtonStyles;
  };
  msgStyles: string[];
};
