// src/components/AttendanceCard.js
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

export default function AttendanceCard({ name, status }) {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box
      p={4}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow="md"
      borderRadius="md"
      m={2}
      width={{ base: "100%", md: "45%", lg: "30%" }}
    >
      <Text fontSize="xl" fontWeight="bold" color={textColor}>
        {name}
      </Text>
      <Text color={textColor}>{status}</Text>
    </Box>
  );
}
