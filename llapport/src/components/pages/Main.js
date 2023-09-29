import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';

function Main() {
  const webcamRef = useRef(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recording, setRecording] = useState(false);

  // 녹화 시작 함수
  const startRecording = () => {
    setRecording(true);
    const options = {
      mimeType: 'video/webm', // 미디어 타입 설정
      bitsPerSecond: 128000, // 비트 속도 설정
    };

    const recorder = RecordRTC(webcamRef.current.stream, options);
    recorder.startRecording();

    setTimeout(() => {
      recorder.stopRecording(() => {
        setRecordedVideo(recorder.getBlob());
        setRecording(false);
      });
    }, 7000); // 7초 동안 녹화

  };

  // 영상을 서버로 업로드하는 함수
  const uploadVideoToServer = () => {
    // 여기서 recordedVideo를 Django 서버로 업로드하는 로직 구현
  };

  return (
    <>
      <div className="App-background">
        <div className='container'>
          <br></br>
          <h1 className='title'>Fast.LLapport 서비스 사용하기</h1>
          <Webcam
            className='container'
            audio={true}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: 'user',
            }}
            ref={webcamRef}
          />
          {recording ? (
            <button className='btn' disabled>녹화 중...</button>
          ) : (
            <button className='btn' onClick={startRecording}>녹화 시작</button>
          )}
          {recordedVideo && (
            <div>
              <video
                src={URL.createObjectURL(recordedVideo)}
                controls
                autoPlay
                width={640}
                height={360}
              ></video>
              <button className='btn' onClick={uploadVideoToServer}>서버로 업로드</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;