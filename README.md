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
  b. year
  c. subject
3. /stackOverFlow/addQuestion: It will help you in adding new question to the database. you will need to use POST method. It requires:
  a. question: String
  b. subject: String
  c. branch: String
  d. year: Number
4. /stackOverFlow/getQuestion/:questionId  : It will return Question. use get method
5. /stackOverFlow/addAnswer/:questionId : It will add answer. Use POST method. It requires following header fields:
  a. answer: String
6. /stackOverFlow/downVoteAnswer/:answerId : It will return Question after making changes. POST method will be used. It requires:
  a. questionid : String
7. /stackOverFlow/upVoteAnswer/:answerId : It will upVote the Question and return Question after making Changes. POST method will be used. It requires:
  a. questionid : String
