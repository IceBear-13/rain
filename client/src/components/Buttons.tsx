import { MouseEventHandler } from "react";

interface buttonContents{
    buttonText: string;
    buttonsId: string;
    buttonName: string;
    onClickFunction?: MouseEventHandler;
};

export default function Buttons({buttonText, buttonsId, buttonName, onClickFunction}: buttonContents) {
  return (
    <div>
      <button
        type="submit"
        className="px-4 py-1 bg-blue-700 text-white rounded-lg hover:bg-blue-800 mt-3 min-w-[150px] hover:cursor-pointer transition-all duration-300 transform hover:scale-105" id={buttonsId} name={buttonName} onClick={onClickFunction}
      >
        <span className="transition-all duration-300 transform hover:scale-105">
          {buttonText}
        </span>
      </button>
    </div>
  );
}
