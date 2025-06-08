import { useState } from 'react';

interface NewChatProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function NewChat({ isVisible, onClose }: NewChatProps) {
    const [rainId, setRainId] = useState('');

    // const handleSubmit = () => {
    //     const recipientId = rainId;
    //     const senderId = localStorage.getItem('userId');

        
    // }
    
    if (!isVisible) return null;
    
    return(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Enter Rain ID</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="input-group">
                        <label htmlFor="rainId" className="block text-sm font-medium text-gray-700">Rain ID:</label>
                        <input
                            type="text"
                            id="rainId"
                            value={rainId}
                            onChange={(e) => setRainId(e.target.value)}
                            placeholder="Enter recipient's Rain ID"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button 
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => {
                            console.log('Rain ID submitted:', rainId);
                            onClose();
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}