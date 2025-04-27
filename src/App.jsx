/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/react';

const LOCAL_STORAGE_KEY = 'saved_photo';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleUp = keyframes`
  from { transform: scale(0.98); }
  to { transform: scale(1); }
`;

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPhoto) setPhoto(savedPhoto);
  }, []);

  useEffect(() => {
    if (!photo) {
      const startCamera = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        } catch (err) {
          alert('⚠️ Доступ до камери заблоковано!');
        }
      };
      startCamera();
    }
    return () => stream?.getTracks().forEach(track => track.stop());
  }, [photo]);

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const data = canvasRef.current.toDataURL('image/webp');
    setPhoto(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, data);
  };

  const deletePhoto = () => {
    setPhoto(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const downloadPhoto = () => {
    const link = document.createElement('a');
    link.href = photo;
    link.download = `photo-${Date.now()}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>📸 Смарт-Камера</h1>
      
      {!photo ? (
        <div css={cameraWrapperStyle}>
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            css={videoStyle}
          />
          <button onClick={takePhoto} css={[buttonStyle, primaryButtonStyle]}>
            <span css={buttonIconStyle}>📷</span>
            Зробити знімок
          </button>
        </div>
      ) : (
        <div css={photoWrapperStyle}>
          <img 
            src={photo} 
            alt="Знімок" 
            css={photoStyle}
            onLoad={() => URL.revokeObjectURL(photo)}
          />
          <div css={buttonGroupStyle}>
            <button onClick={deletePhoto} css={[buttonStyle, dangerButtonStyle]}>
              <span css={buttonIconStyle}>🗑️</span>
              Видалити
            </button>
            <button onClick={downloadPhoto} css={[buttonStyle, successButtonStyle]}>
              <span css={buttonIconStyle}>⤵️</span>
              Завантажити
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} css={hiddenCanvasStyle} />
    </div>
  );
};

// Стилі
const containerStyle = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
  background:rgb(9, 3, 99);
`;

const titleStyle = css`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #1e293b;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.6s ease-out;
`;

const cameraWrapperStyle = css`
  background: white;
  padding: 1.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  animation: ${scaleUp} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const videoStyle = css`
  width: 100%;
  max-width: 640px;
  height: auto;
  border-radius: 1rem;
  display: block;
  margin: 0 auto 1.5rem;
  background: #1e293b;
  transform: translateZ(0);
`;

const photoWrapperStyle = css`
  animation: ${fadeIn} 0.5s ease-out;
`;

const photoStyle = css`
  width: 100%;
  max-width: 640px;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  display: block;
  margin: 0 auto 1.5rem;
  border: 3px solid white;
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const buttonStyle = css`
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.1);
  }
`;

const primaryButtonStyle = css`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #4f46e5, #4338ca);
  }
`;

const successButtonStyle = css`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
  }
`;

const dangerButtonStyle = css`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;

const buttonIconStyle = css`
  font-size: 1.2em;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
`;

const hiddenCanvasStyle = css`
  display: none;
`;

export default App;