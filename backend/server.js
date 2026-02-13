const db = require("./db");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Student Management Backend Running");
});

/* =========================
   STUDENTS CRUD
========================= */

// CREATE (old – optional)
app.post("/api/students", (req, res) => {
  const { name, email, department, year } = req.body;

  const sql =
    "INSERT INTO students (name, email, department, year) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, department, year], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      department,
      year,
    });
  });
});

// READ
app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// UPDATE
app.put("/api/students/:id", (req, res) => {
  const { name, email, department, year } = req.body;
  const { id } = req.params;

  const sql =
    "UPDATE students SET name=?, email=?, department=?, year=? WHERE id=?";

  db.query(sql, [name, email, department, year, id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Student updated successfully" });
  });
});

// DELETE
app.delete("/api/students/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM students WHERE id=?", [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Student deleted successfully" });
  });
});

/* =========================
   DASHBOARD
========================= */
app.get("/api/dashboard", (req, res) => {
  const studentCountQuery = "SELECT COUNT(*) AS totalStudents FROM students";
  const departmentCountQuery =
    "SELECT COUNT(DISTINCT department) AS totalDepartments FROM students";

  db.query(studentCountQuery, (err, studentResult) => {
    if (err) return res.status(500).json(err);

    db.query(departmentCountQuery, (err, deptResult) => {
      if (err) return res.status(500).json(err);

      res.json({
        totalStudents: studentResult[0].totalStudents,
        totalDepartments: deptResult[0].totalDepartments,
      });
    });
  });
});

/* =========================
   REGISTER (STUDENT / FACULTY)
========================= */
app.post("/api/register", (req, res) => {
  const { name, email, password, role, department, year, designation } = req.body;

  if (role === "admin") {
    return res.status(403).json({ message: "Admin cannot register" });
  }

  const userSql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(userSql, [name, email, password, role], (err, userResult) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json(err);
    }

    const userId = userResult.insertId;

    if (role === "student") {
      const studentSql =
        "INSERT INTO students (user_id, name, email, department, year) VALUES (?, ?, ?, ?, ?)";

      return db.query(
        studentSql,
        [userId, name, email, department, year],
        err => {
          if (err) return res.status(500).json(err);
          res.status(201).json({ message: "Student registered successfully" });
        }
      );
    }

    if (role === "faculty") {
      const facultySql =
        "INSERT INTO faculty (user_id, name, email, department, designation) VALUES (?, ?, ?, ?, ?)";

      return db.query(
        facultySql,
        [userId, name, email, department, designation || "Lecturer"],
        err => {
          if (err) return res.status(500).json(err);
          res.status(201).json({ message: "Faculty registered successfully" });
        }
      );
    }
  });
});

/* =========================
   ADMIN – ADD STUDENT
========================= */
app.post("/api/admin/add-student", (req, res) => {
  const { name, email, password, department, year } = req.body;

  const userSql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')";

  db.query(userSql, [name, email, password], (err, userResult) => {
    if (err) return res.status(500).json(err);

    const userId = userResult.insertId;

    const studentSql =
      "INSERT INTO students (user_id, name, email, department, year) VALUES (?, ?, ?, ?, ?)";

    db.query(
      studentSql,
      [userId, name, email, department, year],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Student added successfully" });
      }
    );
  });
});

// ADMIN – VIEW FACULTY
app.get("/api/faculty", (req, res) => {
  db.query("SELECT * FROM faculty", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   ADMIN – VIEW FACULTY
========================= */
app.get("/api/admin/faculty", (req, res) => {
  const sql = `
    SELECT 
      f.id,
      f.name,
      f.email,
      f.department,
      f.designation
    FROM faculty f
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   LOGIN
========================= */
// LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (results.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = results[0];

      if (user.password !== password)
        return res.status(401).json({ message: "Invalid password" });

      res.json({ id: user.id, role: user.role, name: user.name });
    }
  );
});

// GET STUDENT ID BY USER ID
app.get("/api/student/by-user/:userId", (req, res) => {
  db.query(
    "SELECT id FROM students WHERE user_id = ?",
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: "Student not found" });
      res.json(results[0]); // { id: student_id }
    }
  );
});

/* =========================
   Student profile 
   (by user_id — correct)
========================= */
app.get("/api/student/profile/:userId", (req, res) => {
  db.query(
    "SELECT * FROM students WHERE user_id = ?",
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: "Student not found" });
      res.json(results[0]);
    }
  );
});
/* =========================
   Faculty profile
========================= */
app.get("/api/faculty/profile/:userId", (req, res) => {
  db.query(
    "SELECT * FROM faculty WHERE user_id = ?",
    [req.params.userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: "Faculty not found" });
      res.json(results[0]);
    }
  );
});


/* =========================
   COURSES & ENROLLMENT
========================= */
app.post("/api/admin/courses", (req, res) => {
  const { course_code, course_name, department, year } = req.body;

  db.query(
    "INSERT INTO courses (course_code, course_name, department, year) VALUES (?, ?, ?, ?)",
    [course_code, course_name, department, year],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Course added successfully" });
    }
  );
});

app.get("/api/admin/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/admin/enroll-student", (req, res) => {
  const { student_id, course_id } = req.body;

  db.query(
    "INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)",
    [student_id, course_id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student enrolled in course" });
    }
  );
});

/* =========================
   ADMIN – ATTENDANCE MONITORING
========================= */

// ADMIN – COURSE ATTENDANCE OVERVIEW
app.get("/api/admin/attendance/course/:courseId", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT 
      s.id AS student_id,
      s.name,
      COUNT(a.id) AS total_classes,
      SUM(a.status = 'present') AS present_count,
      ROUND(
        (SUM(a.status = 'present') / COUNT(a.id)) * 100,
        2
      ) AS attendance_percentage
    FROM students s
    LEFT JOIN attendance a
      ON s.id = a.student_id AND a.course_id = ?
    GROUP BY s.id
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// FACULTY – MARK ATTENDANCE
app.post("/api/faculty/attendance", (req, res) => {
  const { student_id, course_id, date, status } = req.body;

  const sql = `
    INSERT INTO attendance (student_id, course_id, date, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = ?
  `;

  db.query(
    sql,
    [student_id, course_id, date, status, status],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Attendance marked successfully" });
    }
  );
});
// =========================
// FACULTY – GET EXAMS BY COURSE
// =========================
app.get("/api/faculty/exams/:courseId", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT id, exam_name 
    FROM exams 
    WHERE course_id = ?
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// STUDENT – VIEW ATTENDANCE SUMMARY
app.get("/api/student/attendance/:studentId", (req, res) => {
  const { studentId } = req.params;

  const sql = `
    SELECT 
      c.course_name,
      COUNT(a.id) AS total_classes,
      SUM(a.status = 'present') AS present_count,
      ROUND((SUM(a.status = 'present') / COUNT(a.id)) * 100, 2) AS attendance_percentage
    FROM attendance a
    JOIN courses c ON a.course_id = c.id
    WHERE a.student_id = ?
    GROUP BY c.id
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// FACULTY – VIEW ATTENDANCE BY COURSE
app.get("/api/faculty/attendance/course/:courseId", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT 
      s.id AS student_id,
      s.name,
      COUNT(a.id) AS total_classes,
      SUM(a.status = 'present') AS present_count
    FROM students s
    LEFT JOIN attendance a 
      ON s.id = a.student_id AND a.course_id = ?
    GROUP BY s.id
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   FACULTY – CREATE EXAM
========================= */
app.post("/api/faculty/exams", (req, res) => {
  const { course_id, exam_name, exam_date, total_marks } = req.body;

  if (!course_id || !exam_name || !exam_date || !total_marks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO exams (course_id, exam_name, exam_date, total_marks)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [course_id, exam_name, exam_date, total_marks],
    err => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        message: "Exam created successfully",
      });
    }
  );
});

/* =========================
   ADMIN – MANAGE EXAMS (CRUD)
========================= */

// GET ALL EXAMS
app.get("/api/admin/exams", (req, res) => {
  const sql = `
    SELECT e.*, c.course_name
    FROM exams e
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.exam_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET SINGLE EXAM FOR EDITING
app.get("/api/admin/exams/:id", (req, res) => {
  const sql = "SELECT * FROM exams WHERE id = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "Exam not found" });
    res.json(results[0]);
  });
});

// CREATE EXAM
app.post("/api/admin/exams", (req, res) => {
  const { course_id, exam_name, exam_date, total_marks } = req.body;

  if (!course_id || !exam_name || !exam_date || !total_marks) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = `
    INSERT INTO exams (course_id, exam_name, exam_date, total_marks)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [course_id, exam_name, exam_date, total_marks], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Exam created successfully" });
  });
});

// UPDATE EXAM
app.put("/api/admin/exams/:id", (req, res) => {
  const { course_id, exam_name, exam_date, total_marks } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE exams
    SET course_id = ?, exam_name = ?, exam_date = ?, total_marks = ?
    WHERE id = ?
  `;

  db.query(sql, [course_id, exam_name, exam_date, total_marks, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Exam updated successfully" });
  });
});

// DELETE EXAM
app.delete("/api/admin/exams/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM exams WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Exam deleted successfully" });
  });
});

// FACULTY – ADD / UPDATE STUDENT RESULTS
app.post("/api/faculty/results", (req, res) => {
  let { student_id, exam_id, marks } = req.body;

  // ✅ FORCE NUMBERS (VERY IMPORTANT)
  student_id = Number(student_id);
  exam_id = Number(exam_id);
  marks = Number(marks);

  // ✅ GRADE + STATUS LOGIC
  let grade = "F";
  let status = "Fail";

  if (marks >= 75) grade = "A";
  else if (marks >= 60) grade = "B";
  else if (marks >= 40) grade = "C";

  if (marks >= 40) status = "Pass";

  const sql = `
    INSERT INTO results (student_id, exam_id, marks, grade, status)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      marks = VALUES(marks),
      grade = VALUES(grade),
      status = VALUES(status)
  `;

  db.query(
    sql,
    [student_id, exam_id, marks, grade, status],
    (err, result) => {
      if (err) {
        console.error("RESULT UPSERT ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Result saved successfully",
        student_id,
        exam_id,
        marks,
        grade,
        status,
      });
    }
  );
});


/* =========================
   ADMIN – ASSIGN FACULTY TO COURSE
========================= */
app.post("/api/admin/assign-faculty", (req, res) => {
  const { faculty_id, course_id } = req.body;

  if (!faculty_id || !course_id) {
    return res.status(400).json({ message: "Faculty and Course required" });
  }

  const sql = `
    INSERT INTO faculty_courses (faculty_id, course_id)
    VALUES (?, ?)
  `;

  db.query(sql, [faculty_id, course_id], (err) => {
    if (err) {
      // duplicate assignment
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ message: "Faculty already assigned to this course" });
      }
      return res.status(500).json(err);
    }

    res.json({ message: "Faculty assigned successfully" });
  });
});

/* =========================
   FACULTY – VIEW ASSIGNED COURSES
========================= */
app.get("/api/faculty/courses/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.id,
      c.course_name,
      c.course_code,
      c.department,
      c.year
    FROM faculty_courses fc
    JOIN faculty f ON fc.faculty_id = f.id
    JOIN courses c ON fc.course_id = c.id
    WHERE f.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   STUDENT – GET ENROLLED COURSES
========================= */
app.get("/api/student/courses/:studentId", (req, res) => {
  const { studentId } = req.params;

  const sql = `
    SELECT c.id, c.course_name, c.course_code
    FROM student_courses sc
    JOIN courses c ON sc.course_id = c.id
    WHERE sc.student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   STUDENT – GET RESULTS
========================= */
app.get("/api/student/results/:studentId", (req, res) => {
  const { studentId } = req.params;

  const sql = `
    SELECT 
      r.id,
      r.student_id,
      r.marks,
      r.grade,
      r.status,
      e.exam_name,
      e.exam_date,
      e.total_marks,
      c.course_name
    FROM results r
    JOIN exams e ON r.exam_id = e.id
    JOIN courses c ON e.course_id = c.id
    WHERE r.student_id = ?
    ORDER BY e.exam_date DESC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   ADMIN – GET ALL RESULTS
========================= */
app.get("/api/admin/results", (req, res) => {
  const sql = `
    SELECT 
      r.id,
      r.student_id,
      r.exam_id,
      r.marks,
      r.grade,
      r.status,
      s.name AS student_name,
      e.id AS exam_id,
      e.exam_name,
      e.exam_date,
      e.total_marks,
      e.course_id,
      c.id AS course_id,
      c.course_name
    FROM results r
    JOIN students s ON r.student_id = s.id
    JOIN exams e ON r.exam_id = e.id
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.exam_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   ADMIN – GET RESULTS BY EXAM
========================= */
app.get("/api/admin/results/exam/:examId", (req, res) => {
  const { examId } = req.params;

  const sql = `
    SELECT 
      r.id,
      r.student_id,
      r.marks,
      r.grade,
      r.status,
      s.name AS student_name,
      e.exam_name,
      e.exam_date,
      e.total_marks,
      c.course_name
    FROM results r
    JOIN students s ON r.student_id = s.id
    JOIN exams e ON r.exam_id = e.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.id = ?
    ORDER BY s.name
  `;

  db.query(sql, [examId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   FACULTY – GET STUDENTS IN COURSE
========================= */
app.get("/api/faculty/students/:courseId", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT s.id, s.name
    FROM student_courses sc
    JOIN students s ON sc.student_id = s.id
    WHERE sc.course_id = ?
    ORDER BY s.name
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   GET ALL COURSES (Generic endpoint)
========================= */
app.get("/api/courses", (req, res) => {
  db.query("SELECT * FROM courses ORDER BY course_name", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


/* =========================
   ADMIN – MANAGE FEES
========================= */

// GET ALL STUDENTS WITH FEES STATUS
app.get("/api/admin/fees", (req, res) => {
  const sql = `
    SELECT 
      st.id,
      st.name,
      st.email,
      COALESCE(f.total_fee, 0) AS total_fee,
      COALESCE(SUM(p.amount), 0) AS paid_amount,
      COALESCE(f.total_fee, 0) - COALESCE(SUM(p.amount), 0) AS pending_amount,
      CASE 
        WHEN COALESCE(f.total_fee, 0) = 0 THEN 'No Fee Set'
        WHEN COALESCE(SUM(p.amount), 0) = 0 THEN 'Pending'
        WHEN COALESCE(SUM(p.amount), 0) < COALESCE(f.total_fee, 0) THEN 'Partial'
        ELSE 'Paid'
      END AS fee_status,
      f.fee_due_date
    FROM students st
    LEFT JOIN fees f ON st.id = f.student_id
    LEFT JOIN payments p ON st.id = p.student_id AND p.payment_status = 'Completed'
    GROUP BY st.id, st.name, st.email, f.total_fee, f.fee_due_date
    ORDER BY st.name
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET SPECIFIC STUDENT'S FEES
app.get("/api/admin/fees/:studentId", (req, res) => {
  const { studentId } = req.params;
  
  const sql = `
    SELECT 
      f.id,
      f.student_id,
      st.name,
      st.email,
      f.total_fee,
      f.fee_due_date,
      COALESCE(SUM(p.amount), 0) AS paid_amount,
      f.total_fee - COALESCE(SUM(p.amount), 0) AS pending_amount
    FROM fees f
    JOIN students st ON f.student_id = st.id
    LEFT JOIN payments p ON f.student_id = p.student_id AND p.payment_status = 'Completed'
    WHERE f.student_id = ?
    GROUP BY f.id
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0] || {});
  });
});

// GET STUDENT'S PAYMENT HISTORY
app.get("/api/admin/payments/:studentId", (req, res) => {
  const { studentId } = req.params;
  
  const sql = `
    SELECT 
      p.id,
      p.amount,
      p.payment_date,
      p.payment_mode,
      p.transaction_id,
      p.payment_status,
      p.notes
    FROM payments p
    WHERE p.student_id = ?
    ORDER BY p.payment_date DESC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// RECORD A PAYMENT
app.post("/api/admin/payments", (req, res) => {
  const { student_id, amount, payment_mode, transaction_id, notes } = req.body;

  if (!student_id || !amount || !payment_mode) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO payments 
    (student_id, amount, payment_date, payment_mode, transaction_id, payment_status, notes)
    VALUES (?, ?, NOW(), ?, ?, 'Completed', ?)
  `;

  db.query(sql, [student_id, amount, payment_mode, transaction_id || null, notes || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({
      id: result.insertId,
      message: "Payment recorded successfully"
    });
  });
});

// SET OR UPDATE FEE FOR A STUDENT
app.post("/api/admin/fees", (req, res) => {
  const { student_id, total_fee, fee_due_date } = req.body;

  if (!student_id || !total_fee) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const checkSql = "SELECT id FROM fees WHERE student_id = ?";
  
  db.query(checkSql, [student_id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // UPDATE existing fee
      const updateSql = "UPDATE fees SET total_fee = ?, fee_due_date = ? WHERE student_id = ?";
      db.query(updateSql, [total_fee, fee_due_date || null, student_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Fee updated successfully" });
      });
    } else {
      // INSERT new fee
      const insertSql = "INSERT INTO fees (student_id, total_fee, fee_due_date) VALUES (?, ?, ?)";
      db.query(insertSql, [student_id, total_fee, fee_due_date || null], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({
          id: result.insertId,
          message: "Fee set successfully"
        });
      });
    }
  });
});

// GET FEE PAYMENT REPORTS
app.get("/api/admin/payments/reports", (req, res) => {
  const sql = `
    SELECT 
      DATE(p.payment_date) AS payment_date,
      COUNT(*) AS total_transactions,
      SUM(p.amount) AS total_amount,
      p.payment_mode
    FROM payments p
    WHERE p.payment_status = 'Completed'
    GROUP BY DATE(p.payment_date), p.payment_mode
    ORDER BY p.payment_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   STUDENT – VIEW FEES
========================= */

// GET STUDENT'S OWN FEES
app.get("/api/student/fees/:studentId", (req, res) => {
  const { studentId } = req.params;
  
  const sql = `
    SELECT 
      f.total_fee,
      f.fee_due_date,
      COALESCE(SUM(p.amount), 0) AS paid_amount,
      f.total_fee - COALESCE(SUM(p.amount), 0) AS pending_amount,
      CASE 
        WHEN f.total_fee = 0 THEN 'No Fee Set'
        WHEN COALESCE(SUM(p.amount), 0) = 0 THEN 'Pending'
        WHEN COALESCE(SUM(p.amount), 0) < f.total_fee THEN 'Partial'
        ELSE 'Paid'
      END AS status
    FROM fees f
    LEFT JOIN payments p ON f.student_id = p.student_id AND p.payment_status = 'Completed'
    WHERE f.student_id = ?
    GROUP BY f.id
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0] || {});
  });
});

// GET STUDENT'S PAYMENT HISTORY
app.get("/api/student/payments/:studentId", (req, res) => {
  const { studentId } = req.params;
  
  const sql = `
    SELECT 
      p.id,
      p.amount,
      p.payment_date,
      p.payment_mode,
      p.payment_status
    FROM payments p
    WHERE p.student_id = ?
    ORDER BY p.payment_date DESC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   START SERVER
========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
