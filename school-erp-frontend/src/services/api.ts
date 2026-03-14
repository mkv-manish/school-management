const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";


export const loginUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData?.message || "Login failed");
  return responseData;
};

export const getDashboardStats = async (token: string) => {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};



export const getAllStudents = async (
  token: string,
  params: { page?: number; limit?: number; search?: string; approved?: string } = {}
) => {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.approved) q.set("approved", params.approved);

  const res = await fetch(`${BASE_URL}/students?${q.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const approveUser = async (token: string, userId: string) => {
  const res = await fetch(`${BASE_URL}/admin/approve/${userId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to approve user");
  return res.json();
};

export const getStudentsByClass = async (classId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/students/class/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const markAttendance = async (data: any, token: string) => {
  const res = await fetch(`${BASE_URL}/attendance/mark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getTeachers = async (
  token: string,
  params: { page?: number; limit?: number; search?: string; approved?: string } = {}
) => {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.approved) q.set("approved", params.approved);

  const res = await fetch(`${BASE_URL}/admin/teachers?${q.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch teachers");
  return res.json();
};



export const createNotice = async (token: string, formData: FormData) => {
  const res = await fetch(`${BASE_URL}/notices`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create notice");
  return res.json();
};

export const getNotices = async (token: string) => {
  const res = await fetch(`${BASE_URL}/notices`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch notices");
  return res.json();
};



export const getClasses = async (token: string, search?: string) => {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`${BASE_URL}/classes${q}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
};

export const createClass = async (token: string, payload: { className: string; section?: string }) => {
  const res = await fetch(`${BASE_URL}/classes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create class");
  return res.json();
};

export const updateClass = async (token: string, id: string, payload: { className: string; section?: string }) => {
  const res = await fetch(`${BASE_URL}/classes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update class");
  return res.json();
};

export const deleteClass = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/classes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete class");
  return res.json();
};

export const assignTeacherToClass = async (token: string, classId: string, teacherId: string) => {
  const res = await fetch(`${BASE_URL}/classes/${classId}/assign-teacher`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teacherId }),
  });
  if (!res.ok) throw new Error("Failed to assign teacher");
  return res.json();
};




export const registerStudent = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/auth/register-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Student registration failed");
  return data;
};

export const registerTeacher = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/auth/register-teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Teacher registration failed");
  return data;
};

export const registerAdmin = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/auth/register-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Admin setup failed");
  return data;
};

// classes dropdown for student form
export const getClassesPublic = async () => {
  const res = await fetch(`${BASE_URL}/classes-public`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch classes");
  return data;
};

export const getTeacherDashboard = async (token: string) => {
  const res = await fetch(`${BASE_URL}/teacher/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load teacher dashboard");
  return res.json();
};


export const getMyClassStudents = async (token: string) => {
  const res = await fetch(`${BASE_URL}/attendance/my-class-students`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load students");
  return data;
};

export const getAttendanceByDate = async (token: string, date: string) => {
  const res = await fetch(
    `${BASE_URL}/attendance/by-date?date=${encodeURIComponent(date)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load attendance");
  return data;
};

export const saveAttendance = async (
  token: string,
  payload: { date: string; records: { studentId: string; status: "present" | "absent" }[] }
) => {
  const res = await fetch(`${BASE_URL}/attendance/save`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to save attendance");
  return data;
};

export const getAttendanceHistory = async (token: string) => {
  const res = await fetch(`${BASE_URL}/attendance/history`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load history");
  return data;
};

export const createHomework = async (token: string, fd: FormData) => {
  const res = await fetch(`${BASE_URL}/homework/teacher`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const raw = await res.text();

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error("Non-JSON createHomework response:", raw);
    throw new Error("Server returned invalid response. Check backend upload config.");
  }

  if (!res.ok) throw new Error(data?.message || "Failed to create homework");
  return data;
};

export const getTeacherHomework = async (token: string) => {
  const res = await fetch(`${BASE_URL}/homework/teacher`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch homework");
  return data;
};

export const deleteHomework = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/homework/teacher/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Delete failed");
  return data;
};

export const getMyHomework = async (token: string) => {
  const res = await fetch(`${BASE_URL}/homework/my`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load homework");
  return data;
};

export const submitHomework = async (token: string, fd: FormData) => {
  const res = await fetch(`${BASE_URL}/homework/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Submit failed");
  return data;
};

export const getPendingUsers = async (token: string) => {
  const res = await fetch(`${BASE_URL}/admin/pending-users`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch pending users");
  return data;
};

export const getMyAttendance = async (token: string) => {
  const res = await fetch(`${BASE_URL}/attendance/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load attendance");
  return data;
};

export const getMyResults = async (token: string) => {
  const res = await fetch(`${BASE_URL}/results/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load results");
  return data;
};

export const getHomeworkSubmissions = async (token: string, homeworkId: string) => {
  const res = await fetch(`${BASE_URL}/homework/submissions/${homeworkId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch submissions");
  return data;
};

export const addResult = async (
  token: string,
  payload: {
    studentId: string;
    classId: string;
    subject: string;
    marksObtained: number;
    totalMarks: number;
    examType: "midterm" | "final" | "unit-test";
  }
) => {
  const res = await fetch(`${BASE_URL}/results/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to add result");
  return data;
};

export const deleteNotice = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/notices/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to delete notice");
  return data;
};

export const createFee = async (token: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/fees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create fee");
  return data;
};

export const getAllFees = async (token: string) => {
  const res = await fetch(`${BASE_URL}/fees`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load fees");
  return data;
};

export const getMyFees = async (token: string) => {
  const res = await fetch(`${BASE_URL}/fees/my`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load fees");
  return data;
};

export const updateFee = async (token: string, id: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/fees/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update fee");
  return data;
};

export const deleteFee = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/fees/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to delete fee");
  return data;
};

export const addFeePayment = async (
  token: string,
  id: string,
  payload: any
) => {
  const res = await fetch(`${BASE_URL}/fees/${id}/payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to add payment");
  return data;
};

export const createFeesForClass = async (token: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/fees/bulk/class`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create class fees");
  return data;
};

export const getFeeTypes = async (token: string) => {
  const res = await fetch(`${BASE_URL}/fee-types`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load fee types");
  return data;
};

export const createFeeType = async (token: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/fee-types`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create fee type");
  return data;
};

export const updateFeeType = async (
  token: string,
  id: string,
  payload: any
) => {
  const res = await fetch(`${BASE_URL}/fee-types/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update fee type");
  return data;
};

export const deleteFeeType = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/fee-types/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to delete fee type");
  return data;
};

export const getFeeStructures = async (token: string) => {
  const res = await fetch(`${BASE_URL}/fee-structures`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to load fee structures");
  return data;
};

export const createFeeStructure = async (token: string, payload: any) => {
  const res = await fetch(`${BASE_URL}/fee-structures`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create fee structure");
  return data;
};

export const updateFeeStructure = async (
  token: string,
  id: string,
  payload: any
) => {
  const res = await fetch(`${BASE_URL}/fee-structures/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to update fee structure");
  return data;
};

export const deleteFeeStructure = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/fee-structures/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to delete fee structure");
  return data;
};

export const generateFeesFromStructure = async (
  token: string,
  payload: any
) => {
  const res = await fetch(`${BASE_URL}/fees/generate/from-structure`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to generate fees from structure");
  }
  return data;
};