interface chatProperty{
    channelName: string;
    lastMessage: string;
    id: string;
}

export default function Chats({channelName, lastMessage, id}: chatProperty ){
    return(
        <>
            <div className="w-full border h-[100px] border-l-0 border-r-0 hover:cursor-pointer hover:bg-gray-200" id={id}>
                <div className="flex space-x-2 items-center">
                    <img src="avatar-default.svg" className="size-[40px]"/>
                    <div>
                        <h3>{channelName}</h3>
                        <div className="text-sm text-gray-500">{lastMessage}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
