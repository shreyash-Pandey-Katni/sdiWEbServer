# sdiWEbServer
Work is on progress
1. /students/login: it requires two header values. Those values are following:
  a. University Seat Number (USN): All caps
  b. password: your password (case sensitive)
Base URL: [https://sdi-webserver.herokuapp.com/api/](https://sdi-webserver.herokuapp.com/api) always pass usn and token
APIs:
1. /timetable: It requires two header values. Header values are following:
  a.semester
  b.section
2. /stackOverFlow/questions: It will return at most 50 questions. It requires :
  a. branch
  b. semester
  c. subject
  
