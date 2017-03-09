"""
Assignment 6B: Gradebook
"""

import os

HTML_FRAME_TOP = "<!DOCTYPE HTML>\n<html>\n<head>\n<title>{title}</title>\n" \
                 "<link rel=\"stylesheet\" href=\"{css_path}gradebook.css\"/>\n</head>\n<body>\n"
HTML_FRAME_BOTTOM = "</body>\n</html>\n"


class Gradebook(object):

    def __init__(self):
        self.__students = {}  # dict with student_no as key and name as value
        self.__courses = {}  # dict with course_code as key and name as value
        self.__grades = []
        self.__courseGrades = {}
        self.__semester = {}
        self.__studentCourses = {}

    def __create_folders(self):
        """Generates folder structure."""
        print("Generating folder structure ... ")
        for d in ["courses", "semesters", "students"]:
            os.makedirs("output/" + d, exist_ok=True)

    def __load_data(self):
        """Loads data from input tsv files."""
        # Load students
        print("Loading students.tsv ...")
        with open("students.tsv", "r") as f:
            for line in f:
                student_no, name = line.strip().split("\t")
                self.__students[student_no] = name

        # Load courses
        print("Loading courses.tsv ...")
        with open("courses.tsv", "r") as f:
            for line in f:
                course_code, name = line.strip().split("\t")
                self.__courses[course_code] = name
        # Load grades
        print("Loading courses.tsv ...")
        with open("grades.tsv", "r") as f:
            for line in f:
                student_no, course_code, semester, grade = line.strip().split("\t")
                self.__courseGrades.setdefault(course_code, []).extend([student_no, grade])
                self.__semester.setdefault(semester, set()).update([course_code])
                self.__studentCourses.setdefault(student_no, []).extend([course_code, grade])
                self.__grades.extend([student_no, course_code, semester, grade])

    def __generate_student_files(self):
        """Generates HTML files for students."""
        print("Generating student files ...")
        for student_no, stud_info in sorted(self.__studentCourses.items()):
            path = "output/students/{student_no}.html".replace("{student_no}", student_no)
            with open(path, "w") as f:
                f.write(HTML_FRAME_TOP.replace("{title}", "Grades " + student_no).replace("{css_path}", "../../"))

                # Student ID and name
                f.write("<h2>Student</h2>")
                f.write("<table>\n<tbody>\n")
                f.write("<tr><td>Student no:</td><td>{student_no}</td></tr>\n".replace("{student_no}", student_no))
                f.write("<tr><td>Name:</td><td>{name}</td></tr>\n".replace("{name}", self.__students[student_no]))
                f.write("</tbody>\n</table>\n")

                # Semesters and courses
                f.write("<table>\n<thead>\n<tr><th>Course code</th><th>Name</th><th>Grade</th></tr>\n</thead>\n<tbody>\n")
                for semester, course_codes in sorted(self.__semester.items()):
                    rows = ""
                    for index, item in enumerate(stud_info):
                        if item in course_codes:
                            course_code = item;
                            grade = stud_info[index+1]
                            rows += "<tr><td>{course_code}</td><td>{name}</td><td>{grade}</td></tr>\n"\
                                .replace("{course_code}", course_code).replace("{name}", self.__courses[course_code]).replace("{grade}", grade)
                    if rows != "":
                        f.write("<tr><td colspan='3'> Semester {semester}</td></tr>\n".replace("{semester}", semester))
                        f.write(rows)

    def __generate_course_files(self):
        """Generates HTML files for courses."""
        print("Generating course files ...")
        for course_code, name in sorted(self.__courses.items()):
            path = "output/courses/{course}.html".replace("{course}", course_code)
            with open(path, "w") as f:
                f.write(HTML_FRAME_TOP.replace("{title}", "Course " + course_code).replace("{css_path}", "../../"))
                grade_counter = {
                    'A': 0,
                    'B': 0,
                    'C': 0,
                    'D': 0,
                    'E': 0,
                    'F': 0
                }

                # Students and grades
                f.write("<h1>Course {course_code}</h1>".replace("{course_code}", course_code))
                f.write("<h2>{name}</h2>".replace("{name}", name))
                f.write("<table>\n<thead>\n<tr><th>Student no</th><th>Grade</th>\n</thead>\n<tbody>\n")
                course_list = self.__courseGrades[course_code]
                for index, item in enumerate(course_list):
                    if index % 2 == 0:
                        student_no = item
                    elif index % 2 == 1:
                        grade = item.strip()
                        grade_counter[grade] += 1
                        f.write("<tr><td>{student_no}</td><td>{grade}</td></tr>\n".replace("{student_no}", student_no).replace("{grade}", grade))
                f.write("</tbody>\n</table>\n")
                f.write("<h3>Summary</h3>")
                f.write("<table>\n<thead>\n<tr><th>Grade</th><th>Count</th>\n</thead>\n<tbody>\n")
                for grade, count in grade_counter.items():
                    if count > 0:
                        row = "<tr><td>{grade}</td><td>{count}</td></tr>".replace("{grade}", grade).replace("{count}", str(count))
                        f.write(row)
                f.write("</tbody>\n</table>\n")


    def __generate_semester_files(self):
        """Generates HTML files for semesters."""
        print("Generating semester files ...")
        for semester, courses in self.__semester.items():
            print(courses)
            path = "output/semesters/{semester}.html".replace("{semester}", semester)
            with open(path, "w") as f:
                f.write(HTML_FRAME_TOP.replace("{title}", "Semester " + semester).replace("{css_path}", "../../"))
                f.write("<h1>Semester {semester}</h1>".replace("{semester}", semester))
                f.write("<table>\n<thead>\n<tr><th>Course code</th><th>Name</th><th>#Students</th>\n</thead>\n<tbody>\n")
                for course_code in sorted(courses):
                    print(course_code)
                    name = self.__courses[course_code]
                    num_students = int(len(self.__courseGrades[course_code]) / 2)
                    row = "<tr><td>{course_code}</td><td>{name}</td><td>{num_students}</td></tr>"
                    f.write(row.replace("{course_code}", course_code).replace("{name}", name).replace("{num_students}", str(num_students)))


        pass

    def __generate_index_file(self):
        """Generates the index HTML file."""
        print("Generating index file ...")
        with open("output/index.html", "w") as f:
            f.write(HTML_FRAME_TOP.replace("{title}", "Gradebook Index").replace("{css_path}", "../"))

            # list of students
            f.write("<h2>Students</h2>")
            f.write("<table>\n<thead>\n<tr><th>Student no</th><th>Name</th></tr>\n</thead>\n<tbody>\n")
            for student_no, name in sorted(self.__students.items()):
                row = "<tr><td><a href=\"students/{student_no}.html\">{student_no}</a></td><td>{name}</td></tr>\n"
                f.write(row.replace("{student_no}", student_no).replace("{name}", name))
            f.write("</tbody>\n</table>\n")

            # list of courses
            f.write("<h2>Courses</h2>")
            f.write("<table>\n<thead>\n<tr><th>Course code</th><th>Name</th></tr>\n</thead>\n<tbody>\n")
            for course_code, name in sorted(self.__courses.items()):
                row = "<tr><td><a href=\"courses/{course_code}.html\">{course_code}</a></td><td>{name}</td></tr>\n"
                f.write(row.replace("{course_code}", course_code).replace("{name}", name))
            f.write("</tbody>\n</table>\n")

            # list of semesters
            f.write("<h2>Semesters</h2>")
            f.write("<table>\n<thead>\n<tr><th>Semester</th><th>Courses</th></tr>\n</thead>\n<tbody>\n")
            for semester, course_set in sorted(self.__semester.items()):
                courses = ""
                for course_code in sorted(course_set):
                    courses += "<a href=\"courses/{course_code}.html\">{course_code}</a> ".replace("{course_code}", course_code)
                row = "<tr><td><a href=\"semesters/{semester}.html\">{semester}</a></td><td>{courses}</td></tr>\n"
                f.write(row.replace("{semester}", semester).replace("{courses}", courses))
            f.write(HTML_FRAME_BOTTOM)

    def generate_files(self):
        self.__create_folders()
        self.__load_data()
        self.__generate_student_files()
        self.__generate_course_files()
        self.__generate_semester_files()
        self.__generate_index_file()


def main():
    gradebook = Gradebook()
    gradebook.generate_files()

if __name__ == '__main__':
    main()
