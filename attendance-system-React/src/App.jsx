import { useState, useRef } from "react";
import Webcam from "react-webcam";
import {
  ChakraProvider,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

function App() {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // New state for verification status
  const [isCameraOpen, setIsCameraOpen] = useState(false); // New state for camera visibility
  console.log("🚀 ~ App ~ isCameraOpen:", isCameraOpen);
  const toast = useToast();

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const response = await fetch("http://127.0.0.1:5000/verify_identity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageSrc }),
    });

    const data = await response.json();
    console.log("🚀 ~ capture ~ data:", data);
    if (data.status === "Identity Verified") {
      console.log(data);
      setIsVerified(true); // Set verification status to true
      setIsCameraOpen(false); // Close the camera
      toast({
        title: "Attendance Recorded",
        description: `Welcome, ${data.name}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else if (data.status === "Identity Not Verified") {
      if (!isRegistered) {
        setIsRegistered(true);
        toast({
          title: "Not Recognized",
          description: "Please register your face.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Not Recognized",
          description: "Please try again.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const register = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    // Upload the image first
    const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: new FormData(
        new FormData().append("file", dataURItoBlob(imageSrc))
      ),
    });

    const uploadData = await uploadResponse.json();
    if (uploadData.status === "File uploaded") {
      // Then register the face
      const registerResponse = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_path: uploadData.file_path, name: name }),
      });

      const registerData = await registerResponse.json();
      if (registerData.status === "Registration Successful") {
        toast({
          title: "Registration Successful",
          description: "You can now verify your identity.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsRegistered(false);
        setName("");
      } else {
        toast({
          title: "Error",
          description: registerData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: uploadData.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Box p={8} rounded="md" shadow="md">
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            AI-Based Attendance System
          </Heading>
          {isCameraOpen && !isVerified && (
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          )}
          {isRegistered ? (
            <FormControl id="name" isRequired mt={4}>
              <FormLabel>Enter your name:</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button colorScheme="teal" mt={4} onClick={register}>
                Register
              </Button>
            </FormControl>
          ) : (
            <Stack spacing={4} mt={6} direction="column" align="center">
              <Button
                _disabled={!isCameraOpen}
                colorScheme="blue"
                onClick={capture}
                disabled={true}
              >
                Verify Identity
              </Button>
              <Button
                // disabled={!isCameraOpen}
                colorScheme={isCameraOpen ? "red" : "green"}
                onClick={() => setIsCameraOpen(!isCameraOpen)}
              >
                {isCameraOpen ? "Close Camera" : "Open Camera"}
              </Button>
            </Stack>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
