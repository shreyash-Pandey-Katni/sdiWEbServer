# sdiWEbServer

Work is on progress

1. /students/login: it requires two header values. Those values are following:

* Method: GET
* University Seat Number (USN): All caps
* password: your password (case sensitive)
Base URL: [https://graph.resnal.ml:2019/api/](https://graph.resnal.ml:2019/api) always pass usn and token
APIs:

  1. /timetable: It requires two header values. Header values are following:

     * Method: GET
     * semester: Number
     * section: String

  2. /stackOverFlow/questions: It will return at most 50 questions. It requires :

     * Method: GET
     * branch: String
     * year: Number
     * subject: String

  3. /stackOverFlow/addQuestion: It will help you in adding new question to the database. It requires:

     * Method: POST
     * question: String
     * subject: String
     * branch: String
     * year: Number

  4. /stackOverFlow/getQuestion/:questionId  : It will return Question.

     * Method: GET

  5. /stackOverFlow/addAnswer/:questionId : It will add answer. Use POST method. It requires following header fields:

     * answer: String

  6. /stackOverFlow/downVoteAnswer/:answerId : It will return Question after making changes. POST method will be used. It requires:

     * Method: POST
     * questionid : String

  7. /stackOverFlow/upVoteAnswer/:answerId : It will upVote the Question and return Question after making Changes. POST method will be used. It requires:

     * Method: POST
     * questionid : String

3. Notes Route, you can access notes and question papers by using following routes:
   route: /notes

  Routes available in notes route:

  1. /listOfSubjects: you will get access to list of Subjects whose notes are available.
     * Method: GET
     * semester: Number
  2. /listOfNotes: you will get list of Notes.
     * Method: GET
     * semester: Number
     * subject: String
  3. /getNotes: It will give access to a particular Notes.
     * Method: GET
     * semester: Number
     * subject: String
     * file_name: String
  4. /listOfYears: It will return List of years whose notes are available.
     * Method: GET
  5. /getExamListOfYear: It will return list of Exams conducted on that year.
     * Method: GET
     * year: Number
  6. /getListOfAvailableSemesters: It will return list of Available Semesters.
     * Method: GET
     * year: Number
     * month: String
  7. /getPreviousYearQuestionPapers: It will return list of available Previous year question paper in DB.
     * Method: GET
     * year: Number
     * month: String
     * semester_month: String
  8. /downloadQuestionPaper: It will return the pdf format file of Question paper.
     * Method: GET
     * year: Number
     * month: String
     * semester_month: String
     * file_name: String
