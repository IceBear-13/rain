import React from "react";

interface chatProperty{
    channelName: string;
    lastMessage: string;
    id: string;
}

export default function Chats({channelName, lastMessage, id}: chatProperty ){
    const handleClick = (e: React.MouseEvent) => {
        const target = e.currentTarget as HTMLDivElement;
        const chatId = target.id;
        console.log('Clicked chatId:', chatId);
        localStorage.setItem('selectedChatId', chatId);
        window.dispatchEvent(new Event('chat-selected')); // Custom event to notify other components
        window.location.href = `/chat/${chatId}`;
        const chatElement = document.getElementById(chatId);
        if (chatElement) {
            chatElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return(
        <>
            <div className="w-full border h-[100px] border-l-0 border-r-0 hover:cursor-pointer hover:bg-gray-200" id={id} onClick={handleClick}>
                <div className="flex space-x-2 items-center">
                    <img src="/avatar-default.svg" className="size-[40px]"/>
                    <div>
                        <h3>{channelName}</h3>
                        <div className="text-sm text-gray-500">{lastMessage}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
