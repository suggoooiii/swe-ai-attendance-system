import "./App.css";
// import CheckIn from "./components/Checkin";
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
function App() {
  const attendees = [
    { name: "John Doe", status: "Present" },
    { name: "Jane Smith", status: "Absent" },
    { name: "Alice Johnson", status: "Present" },
    { name: "Bob Williams", status: "Present" },
    { name: "Emily Davis", status: "Absent" },
    { name: "Michael Brown", status: "Present" },
    { name: "Sarah Wilson", status: "Present" },
    { name: "David Taylor", status: "Absent" },
    { name: "Olivia Anderson", status: "Present" },
    { name: "James Martinez", status: "Absent" },
    { name: "Sophia Thomas", status: "Present" },
    { name: "Daniel Hernandez", status: "Present" },
    { name: "Mia Moore", status: "Absent" },
    { name: "Jacob Martin", status: "Present" },
    { name: "Isabella Jackson", status: "Present" },
  ];
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");
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
