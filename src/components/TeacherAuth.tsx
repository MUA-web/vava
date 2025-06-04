
import AuthForm from './AuthForm';

interface TeacherAuthProps {
  onBack: () => void;
}

const TeacherAuth = ({ onBack }: TeacherAuthProps) => {
  return <AuthForm onBack={onBack} userType="teacher" />;
};

export default TeacherAuth;
