import { supabase } from '@/integrations/supabase/client';

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

export const checkLectureStatus = async () => {
  try {
    const { data: sessions } = await supabase
      .from('lecture_sessions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!sessions || sessions.length === 0) {
      return { isActive: false, remainingTime: null };
    }

    const session = sessions[0];
    const now = new Date().getTime();
    const endTime = session.end_time ? new Date(session.end_time).getTime() : now + (session.duration || 0) * 60 * 1000;
    const remainingMs = endTime - now;

    if (remainingMs <= 0) {
      // Deactivate the session
      await supabase
        .from('lecture_sessions')
        .update({ is_active: false })
        .eq('id', session.id);
      
      return { isActive: false, remainingTime: null };
    }

    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    return {
      isActive: true,
      remainingTime: `${remainingMinutes} min`
    };
  } catch (error) {
    console.error('Error checking lecture status:', error);
    return { isActive: false, remainingTime: null };
  }
};

export const saveStudentSubmission = async (submission: StudentSubmission) => {
  try {
    const { error } = await supabase
      .from('student_submissions')
      .insert({
        student_id: submission.studentId,
        student_name: submission.studentName,
        code: submission.code,
        output: submission.output
      });

    if (error) {
      console.error('Error saving submission:', error);
    }
  } catch (error) {
    console.error('Error saving submission:', error);
  }
};

export const getStudentSubmissions = async (): Promise<StudentSubmission[]> => {
  try {
    const { data: submissions } = await supabase
      .from('student_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    return submissions?.map(sub => ({
      studentId: sub.student_id,
      studentName: sub.student_name,
      code: sub.code,
      timestamp: sub.created_at,
      output: sub.output
    })) || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
};

export const clearOldSubmissions = async (olderThanHours: number = 24) => {
  try {
    const cutoffTime = new Date(Date.now() - (olderThanHours * 60 * 60 * 1000)).toISOString();
    
    const { error } = await supabase
      .from('student_submissions')
      .delete()
      .lt('created_at', cutoffTime);

    if (error) {
      console.error('Error clearing old submissions:', error);
    }
  } catch (error) {
    console.error('Error clearing old submissions:', error);
  }
};

export const getTeacherPosts = async () => {
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    return posts?.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      timestamp: post.created_at,
      author: post.author,
      voiceNote: post.voice_note_url ? {
        audioUrl: post.voice_note_url,
        duration: post.voice_note_duration || 0
      } : undefined,
      video: post.video_url ? {
        videoUrl: post.video_url,
        duration: post.video_duration || 0,
        fileName: post.video_filename || 'video.mp4',
        fileSize: post.video_filesize || 0,
        transcript: post.video_transcript || undefined
      } : undefined,
      code: post.code_content ? {
        code: post.code_content,
        language: post.code_language || 'python',
        description: post.code_description || undefined
      } : undefined
    })) || [];
  } catch (error) {
    console.error('Error fetching teacher posts:', error);
    return [];
  }
};

export const saveTeacherPost = async (post: any) => {
  try {
    const { error } = await supabase
      .from('posts')
      .insert({
        title: post.title,
        content: post.content,
        type: post.type,
        author: post.author,
        voice_note_url: post.voiceNote?.audioUrl || null,
        voice_note_duration: post.voiceNote?.duration || null,
        video_url: post.video?.videoUrl || null,
        video_duration: post.video?.duration || null,
        video_filename: post.video?.fileName || null,
        video_filesize: post.video?.fileSize || null,
        video_transcript: post.video?.transcript || null,
        code_content: post.code?.code || null,
        code_language: post.code?.language || null,
        code_description: post.code?.description || null
      });

    if (error) {
      console.error('Error saving teacher post:', error);
    }
  } catch (error) {
    console.error('Error saving teacher post:', error);
  }
};

export const startLectureSession = async (duration: number) => {
  try {
    // First, deactivate any existing sessions
    await supabase
      .from('lecture_sessions')
      .update({ is_active: false })
      .eq('is_active', true);

    // Create new session
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    const { error } = await supabase
      .from('lecture_sessions')
      .insert({
        is_active: true,
        duration,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString()
      });

    if (error) {
      console.error('Error starting lecture session:', error);
    }
  } catch (error) {
    console.error('Error starting lecture session:', error);
  }
};

export const stopLectureSession = async () => {
  try {
    const { error } = await supabase
      .from('lecture_sessions')
      .update({ is_active: false })
      .eq('is_active', true);

    if (error) {
      console.error('Error stopping lecture session:', error);
    }
  } catch (error) {
    console.error('Error stopping lecture session:', error);
  }
};

// Upsert a student's session/online status
export async function upsertStudentSession(studentId: string, studentName: string, sessionId: string) {
  const { error } = await supabase
    .from('student_sessions')
    .upsert({
      student_id: studentId,
      student_name: studentName,
      session_id: sessionId,
      last_seen: new Date().toISOString(),
    }, { onConflict: ['student_id', 'session_id'] });
  return { error };
}

// Fetch all students active in a session within the last X minutes (default 2)
export async function getOnlineStudents(sessionId: string, withinMinutes = 2) {
  const since = new Date(Date.now() - withinMinutes * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('student_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .gte('last_seen', since);
  return { data, error };
}

// Fetch all students who have ever joined a session
export async function getAllSessionStudents(sessionId: string) {
  const { data, error } = await supabase
    .from('student_sessions')
    .select('*')
    .eq('session_id', sessionId);
  return { data, error };
}
