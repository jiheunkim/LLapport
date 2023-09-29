import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import Webcam from 'react-webcam';

function Main() {
  return (
    <>
      <div className="App-background">
        <div className='container'>
          <br></br>
          <h1 className='title'>Main</h1>
          <Webcam
            className='container'
            audio={true} // 오디오 사용 여부
            videoConstraints={{
              width: 1280, // 원하는 비디오 너비
              height: 720, // 원하는 비디오 높이
              facingMode: 'user', // 전면 카메라 사용 (user) 또는 후면 카메라 사용 (environment)
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Main;