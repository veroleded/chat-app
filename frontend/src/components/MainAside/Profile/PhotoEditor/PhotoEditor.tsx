import React, { useRef, useState } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { observer } from 'mobx-react-lite';
import { useFormik } from 'formik';
import { Modal } from '../../../ModalContainer/Modal';

const PhotoEditor = observer(() => {
  const cropperRef = useRef<ReactCropperElement>(null);

  const [previewUrl, setPreviewUrl] = useState<null | string>(null);

  const formik = useFormik({
    initialValues: { avatar: null },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue('avatar', file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewUrl(URL.createObjectURL(file));
        }
      };
      setPreviewUrl(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedImageBase64 = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
      // Сохранение обрезанного изображения или обработка его
    }
  };

  return (
    <Modal miniH='Загрузка новой фотографии'>
      <hr className='bg-gray-500 h-[1px]' />
      {previewUrl && (
        <div className='h-[200px]'>
          <Cropper
            src={previewUrl}
            style={{ height: 400, width: '100%' }}
            zoomTo={0.5}
            initialAspectRatio={1}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true} // Укажите соотношение сторон, если нужно
            guides={true}
            crop={handleCrop}
            autoCropArea={1}
            checkOrientation={false}
            ref={cropperRef}
          />
        </div>
      )}
      {!previewUrl && (
        <p className='mt-7 mx-3 text-gray-200 text-center'>
          Друзьям будет проще узнать вас, если вы загрузите свою настоящую фотографию. Вы можете загрузить
          изображение в формате JPG, JPEG, PNG.
        </p>
      )}
      <form className='flex flex-col items-center mt-5' onSubmit={formik.handleSubmit}>
        {!previewUrl && (
          <input
            accept='image/jpeg,image/png'
            onChange={handleFileChange}
            type='file'
            id='avatar'
            name='avatar'
            className=' mx-2 text-gray-200 file:bg-color-gray-200 file:rounded-sm file:mx-5 file:border-none file:cursor-pointer file:text-blue-900 file:p-3'
          />
        )}
        {previewUrl && (
          <button
            type='submit'
            disabled={formik.isSubmitting}
            className='text-gray-200 border px-5 py-3 hover:scale-110 transition-all rounded'>
            Сохранить
          </button>
        )}
      </form>
      <hr className='bg-gray-500 h-[1px] mt-5' />
      <p className=' text-gray-200 text-sm text-center mt-5 mb-5'>
        Если у вас возникают проблемы с загрузкой, попробуйте выбрать фотографию меньшего размера.
      </p>
    </Modal>
  );
});

export default PhotoEditor;
