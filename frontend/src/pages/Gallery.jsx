import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch photos from Firestore
  const fetchPhotos = async () => {
    const snapshot = await getDocs(collection(db, 'photos'));
    setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle file upload with progress and error handling
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Update progress
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(percent);
        },
        (error) => {
          setUploading(false);
          alert('Upload failed: ' + error.message);
        },
        async () => {
          // Upload completed successfully
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'photos'), {
            url,
            caption,
            uploadedAt: serverTimestamp(),
          });
          setFile(null);
          setCaption('');
          setProgress(0);
          setUploading(false);
          fetchPhotos();
        }
      );
    } catch (err) {
      setUploading(false);
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '2rem auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2>Gallery</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          style={{ marginLeft: 8, padding: 4, borderRadius: 4, border: '1px solid #ddd' }}
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            marginLeft: 8,
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '0.5rem 1rem',
            cursor: file && !uploading ? 'pointer' : 'not-allowed'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {uploading && (
          <span style={{ marginLeft: 16, color: '#374151' }}>
            Upload Progress: {progress}%
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {photos.length === 0 && <div>No photos yet.</div>}
        {photos.map(photo => (
          <div key={photo.id} style={{
            width: 180, padding: 8, border: '1px solid #eee', borderRadius: 8, textAlign: 'center'
          }}>
            <img src={photo.url} alt={photo.caption || 'Photo'} style={{ width: '100%', borderRadius: 6 }} />
            <div style={{ marginTop: 6, color: '#374151', fontSize: 14 }}>{photo.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
