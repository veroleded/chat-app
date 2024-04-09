import React from 'react';

const Chat = () => {
  return (
    <main className='flex-1 flex flex-col'>
      <div className='flex-1 overflow-y-auto bg-gray-100 p-4' id='chatContainer'>
        <div className='flex mb-2 justify-end'>
          <div className='max-w-xs rounded-lg px-4 py-2 bg-green-500 text-white self-end'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet ante nisi, id suscipit
              mauris interdum non.
            </p>
          </div>
        </div>
        <div className='flex mb-2 justify-start'>
          <div className='max-w-xs rounded-lg px-4 py-2 bg-white text-gray-800 self-start'>
            <p>Received message</p>
          </div>
        </div>
      </div>

      <footer className='bg-gray-200 p-4'>
        <div className='flex'>
          <input
            type='text'
            id='messageInput'
            placeholder='Enter message...'
            className='flex-1 p-2 rounded-lg border focus:outline-none'
          />
          <button className='bg-green-500 text-white px-4 py-2 ml-2 rounded-lg'>Send</button>
        </div>
      </footer>
    </main>
  );
};

export default Chat;
