
interface LectureSession {
  isActive: boolean;
  duration: number;
  startTime: string;
  endTime: string;
}

interface StudentSubmission {
  studentId: string;
  studentName: string;
  code: string;
  timestamp: string;
  output: string;
}

export const checkLectureStatus = () => {
  const lectureData = localStorage.getItem('lectureSession');
  
  if (!lectureData) {
    return { isActive: false, remainingTime: null };
  }

  const session: LectureSession = JSON.parse(lectureData);
  const now = new Date().getTime();
  const endTime = new Date(session.endTime).getTime();
  const remainingMs = endTime - now;

  if (remainingMs <= 0) {
    localStorage.removeItem('lectureSession');
    return { isActive: false, remainingTime: null };
  }

  const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
  return {
    isActive: true,
    remainingTime: `${remainingMinutes} min`
  };
};

export const saveStudentSubmission = (submission: StudentSubmission) => {
  const submissions = getStudentSubmissions();
  submissions.push(submission);
  localStorage.setItem('studentSubmissions', JSON.stringify(submissions));
};

export const getStudentSubmissions = (): StudentSubmission[] => {
  const data = localStorage.getItem('studentSubmissions');
  return data ? JSON.parse(data) : [];
};

export const clearOldSubmissions = (olderThanHours: number = 24) => {
  const submissions = getStudentSubmissions();
  const cutoffTime = new Date().getTime() - (olderThanHours * 60 * 60 * 1000);
  
  const filteredSubmissions = submissions.filter(
    submission => new Date(submission.timestamp).getTime() > cutoffTime
  );
  
  localStorage.setItem('studentSubmissions', JSON.stringify(filteredSubmissions));
};

export const getTeacherPosts = () => {
  const data = localStorage.getItem('teacherPosts');
  return data ? JSON.parse(data) : [];
};

export const saveTeacherPost = (post: any) => {
  const posts = getTeacherPosts();
  posts.unshift(post);
  localStorage.setItem('teacherPosts', JSON.stringify(posts));
};
