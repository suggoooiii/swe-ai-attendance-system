import "./App.css";
import {
  Box,
  Flex,
  Text,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { AttendanceCard } from "./components";
import WebcamCapture from "./components/WebcamCapture";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [attendees, setAttendees] = useState([]);
  console.log("🚀 ~ App ~ attendees:", attendees);

  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/attendees");
        console.log("🚀 ~ fetchAttendees ~ response:", response);
        setAttendees(response.data);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };

    fetchAttendees();
  }, []);
  return (
    <Box bg={bg} color={color} minH="100vh" p={4}>
      <Flex justify="space-between" align="center" mb={8}>
        <Text fontSize="2xl" fontWeight="bold">
          Attendance App
        </Text>
        <Button onClick={toggleColorMode}>
          Toggle {useColorModeValue("Dark", "Light")} Mode
        </Button>
      </Flex>
      <Flex wrap="wrap" spacing={4}>
        {attendees.map((attendee, index) => (
          <AttendanceCard
            key={index}
            name={attendee.name}
            status={attendee.status}
          />
        ))}
      </Flex>
      <Flex>
        <WebcamCapture />
      </Flex>
    </Box>
  );
}

export default App;
