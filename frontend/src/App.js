import './App.css';

import React, { useState } from 'react';
import axios from 'axios';

const UploadImageForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleImageChange = event => {
    setSelectedImage(event.target.files[0]);
  };

  const handleTitleChange = event => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', selectedImage);

    axios
      .post('http://127.0.0.1:8000/post/', formData)
      .then(response => {
        // アップロード成功の処理
        console.log(response.data);
      })
      .catch(error => {
        // エラーハンドリング
        console.error(error);
      });
  };

  return (
    <div>
      <h2>画像をアップロードする</h2>
      <form>
        <div>
          <label htmlFor="image">画像ファイル：</label>
          <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
        </div>
        <div>
          <label htmlFor="title">タイトル：</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label htmlFor="description">説明：</label>
          <textarea id="description" value={description} onChange={handleDescriptionChange} />
        </div>
        <button type="button" onClick={handleUpload} disabled={!selectedImage || !title || !description}>
          アップロード
        </button>
      </form>
    </div>
  );
};

export default UploadImageForm;
