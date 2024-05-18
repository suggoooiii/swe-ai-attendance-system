// src/components/AttendanceCard.js
import { Box, Text } from "@chakra-ui/react";

export default function AttendanceCard({ name, status }) {
  return (
    <Box
      p={4}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      m={2}
      width={{ base: "100%", md: "45%", lg: "30%" }}
    >
      <Text fontSize="xl" fontWeight="bold">
        {name}
      </Text>
      <Text>{status}</Text>
    </Box>
  );
}

