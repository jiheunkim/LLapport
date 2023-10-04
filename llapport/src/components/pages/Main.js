import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import '../Button.css';

function Main() {
  const webcamRef = useRef(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recording, setRecording] = useState(false);
  const [responseState, setResponseState] = useState(null);
  const [responseDescription, setResponseDescription] = useState('');

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
    // recordedVideo가 null이면 업로드하지 않음
  if (!recordedVideo) {
    return;
  }

  // FormData 객체 생성
  const formData = new FormData();
  formData.append('video', recordedVideo, 'recorded-video.webm'); // 'video'는 서버에서 파일을 받을 때의 키 이름, 'recorded-video.webm'은 업로드할 파일의 이름

  // 서버 업로드 URL 설정 (서버의 업로드 API 엔드포인트 주소를 입력해야 합니다)
  const uploadUrl = 'http://34.64.47.129:8000/llapport/showapi'; // 실제 서버의 업로드 API 주소로 변경해야 함

  // 파일 업로드 요청 보내기
  fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      const { state, description } = data.data; // 서버 응답에서 상태와 설명 메시지 추출
      setResponseState(state);
      setResponseDescription(description);
      // 서버 응답에 따른 로직을 추가할 수 있습니다.
    })
    .catch(error => {
      console.error('업로드 실패:', error);
      // 업로드 실패 시 처리할 로직을 추가할 수 있습니다.
    });
  };

  let circleColor = 'gray';
  let message = '상태를 확인 중입니다...';

  if (responseState === 1) {
    circleColor = 'red';
    message = responseDescription; // 백엔드에서 온 설명 메시지를 사용
  } else if (responseState === 2) {
    circleColor = 'yellow';
    message = responseDescription;
  } else if (responseState === 3) {
    circleColor = 'green';
    message = responseDescription;
  }

  return (
    <>
      <div className="App-background">
      <div className='container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <br></br>
          {/* <h1 className='title'>Fast.LLapport 서비스 사용하기</h1> */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              background: circleColor,
              marginBottom:'20px',
              marginTop:'-20px'
            }}></div>
          </div>
          <Webcam
            className='container'
            audio={true}
            height={540}
            width={960}
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
            <button className='btn' style={{ marginTop: '20px' }} onClick={startRecording}>RECORD</button>
          )}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p>{message}</p>
          </div>
          {recordedVideo && (
            <div>
              <video
                src={URL.createObjectURL(recordedVideo)}
                controls
                autoPlay
                width={640}
                height={360}
              ></video>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button className='btn' onClick={uploadVideoToServer}>START</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;