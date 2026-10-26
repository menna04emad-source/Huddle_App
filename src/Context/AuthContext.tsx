import { createContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

// 1. Define the type of the context value
type AuthContextType = {
  userLogin: string | null;
  setuserLogin: Dispatch<SetStateAction<string | null>>;
};

export const Authcontext = createContext<AuthContextType>({
    userLogin: null,
  setuserLogin: ()=>{} ,
});

type AuthcontextProviderProps = {
  children: ReactNode;
};

// 2. Provider
export default function AuthcontextProvider({
  children,
}: AuthcontextProviderProps) {
  const [userLogin, setuserLogin] = useState<string | null>(() =>localStorage.getItem("userToken"));

  return (
    <Authcontext.Provider value={{ userLogin, setuserLogin }}>
      {children}
    </Authcontext.Provider>
  );
}