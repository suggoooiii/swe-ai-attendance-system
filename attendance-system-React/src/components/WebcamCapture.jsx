/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box, Button, Input, useToast } from "@chakra-ui/react";
import axios from "axios";

const WebcamCapture = ({ fetchAttendees }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [name, setName] = useState("");
  const toast = useToast();

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
        }
      );

      if (response.data.status === "Identity Verified") {
        toast({
          title: "Identity Verified",
          description: `Welcome, ${response.data.name}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        fetchAttendees(); // Fetch attendees after successful verification
      } else if (response.data.status === "Identity Not Verified") {
        toast({
          title: "Identity Not Verified",
          description: "Please proceed with registration.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setShowRegistration(true);
      } else {
        toast({
          title: "Error",
          description: response.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while verifying identity.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const register = async () => {
    try {
      // Convert base64 image to Blob
      const byteString = atob(imgSrc.split(",")[1]);
      const mimeString = imgSrc.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      // First, upload the image
      const uploadResponse = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData
      );
      const filePath = uploadResponse.data.file_path;

      // Then, register the face using the uploaded image file path
      const registerResponse = await axios.post(
        "http://127.0.0.1:5000/register",
        {
          file_path: filePath,
          name: name,
        }
      );

      if (registerResponse.data.status === "Registration Successful") {
        toast({
          title: "Registration Successful",
          description: `Welcome, ${name}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowRegistration(false);
        fetchAttendees(); // Fetch attendees after successful registration
      } else {
        toast({
          title: "Error",
          description: registerResponse.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
      {showRegistration && (
        <Box mt={4}>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={register} mt={2}>
            Register
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WebcamCapture;
