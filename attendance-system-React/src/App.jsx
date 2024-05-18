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
function App() {
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
        <AttendanceCard name="John Doe" status="Present" />
        <AttendanceCard name="Jane Smith" status="Absent" />
        <AttendanceCard name="Alice Johnson" status="Present" />
      </Flex>
    </Box>
  );
}

export default App;
