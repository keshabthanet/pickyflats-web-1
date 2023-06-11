/* eslint-disable @next/next/no-img-element */
interface Iprops {
  fileID: string;
}

import { CONTENT_BUCKET, storage } from '@/lib/client';

export const ImageCard = (props: Iprops) => {
  const { fileID } = props;

  const file = storage.getFilePreview(CONTENT_BUCKET, fileID);

  // const deleteImg=()=> {
  //   alert('deel')
  // }

  return (
    <div className='relative h-full w-full'>
      <img
        src={file.href}
        alt='preview image'
        className=' h-full w-full object-cover'
      />
      {/* <Image src={props.url} fill alt='preview image' /> */}

      {/* <div className='absolute top-0 right-0'><IconButton onClick={()=>deleteImg()}>D</IconButton></div> */}
    </div>
  );
};
