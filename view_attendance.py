import sqlite3

# Path to the database file
db_path = 'attendance.db'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Query to fetch all records from the attendance table
cursor.execute('SELECT * FROM attendance')

# Fetch all rows
rows = cursor.fetchall()

# Print the attendance records
print("Attendance Records:")
print("ID | Name | Date | Time")
print("-" * 30)
for row in rows:
    print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]}")

# Close the database connection
conn.close()