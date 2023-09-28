import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

function Main() {
  const videoRef = useRef(null);

  // 사용자 웹캠에 접근
  const getUserCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.load(); // 비디오 다시 로드
        video.play().catch((error) => {
          console.log('비디오를 재생할 수 없습니다: ', error);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  useEffect(() => {
    getUserCamera();
  }, []);

  return (
    <>
      <div className="App-background">
        <div className='container'>
            <br></br>
            <h1 className='title'>Main</h1>
            <video className='container' ref={videoRef}></video>
        </div>
      </div>
    </>
  );
}

export default Main;