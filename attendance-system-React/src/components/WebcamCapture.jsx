import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box, Button } from "@chakra-ui/react";
import axios from "axios";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  console.log("🚀 ~ WebcamCapture ~ imgSrc:", imgSrc);

  const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user",
  };

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/verify_identity",
        {
          image: imageSrc,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      // Handle the response from the backend
      // You can update the UI or show a message based on the response
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Box>
      <Webcam
        ref={webcamRef}
        height={240}
        width={350}
        audio={false}
        videoConstraints={videoConstraints}
        screenshotFormat="image/jpeg"
      />
      <Button onClick={capture}>Capture photo</Button>
    </Box>
  );
};

export default WebcamCapture;
