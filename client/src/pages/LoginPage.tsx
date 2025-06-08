import { useState } from "react";
import Textbox from "../components/Textbox";
import Passwordbox from "../components/Password";
import Buttons from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthAPI";

export const BACKEND_URL = 'https://rbxdcpy-api.vercel.app/';

export default function Login() {
  // const [isVerified, setIsVerified] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const navigate = useNavigate();

  const handleSignin = () => {
    const username = (document.getElementById("uNameLogin") as HTMLInputElement).value;
    const password = (document.getElementById("pwdLogin") as HTMLInputElement).value;
    const response = login(username, password);
    response
        .then((res) => {
            if (res.success === "true" || res.success === true) {
                // setIsVerified(true);
                localStorage.setItem("token", res.token);
                localStorage.setItem("rain_id", res.user.id);
                localStorage.setItem("username", res.user.username);
                console.log(res);
                navigate("/chat");
            } else{
              setWrongCredentials(true);
            }
        })
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSignin();
        }
    };
  return (
    <div className="w-full h-screen flex py-[5%] px-[10%]">
      <div className="w-full h-full m-auto rounded-lg flex justify-between space-x-10 p-5 border border-gray-200 shadow-xl">
        <div className="w-[45%] lg:flex items-center justify-center hidden">
          <img
            src="thisartwork.jpg"
            className="w-full h-full object-cover rounded-lg hover:scale-102 transition duration-300"
          />
        </div>
        <div className="px-2 w-[45%] flex flex-col flex-grow overflow-auto">
          <h1 className="text-lg font-bold mb-4 mt-1">Sign in</h1>
          {wrongCredentials && <h3 className="text-red-500 text-[20px]">Trying to be someone else? Lock in.</h3>}
          <Textbox
            name="uNameLogin"
            id="uNameLogin"
            labelContent="Rain ID"
            placeholder="Enter your Rain ID"
            onKeyDown={handleKeyPress}
          />
          <Passwordbox id="pwdLogin" name="pwdLogin" labelContent="Password" onKeyDown={handleKeyPress} />
          <div className="mb-5">
            <input type="checkbox" id="rememberMe" name="rememberMe" />
            <label htmlFor="rememberMe" className="ml-2 text-[18px]">
              Remember me
            </label>
          </div>
          <Buttons buttonText="Sign in" buttonsId="signin" buttonName="signin" onClickFunction={handleSignin}/>

          <div className="mt-auto text-[18px]">
            <a className="underline hover:text-gray-600 hover:cursor-pointer transition duration-300" href="/signup">
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
