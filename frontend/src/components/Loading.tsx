import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className='w-screen h-screen absolute flex items-center justify-center'>
      <ClipLoader color='white' size={50} />
    </div>
  );
};

export default Loading;
