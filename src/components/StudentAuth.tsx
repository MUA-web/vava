
import AuthForm from './AuthForm';

interface StudentAuthProps {
  onBack: () => void;
}

const StudentAuth = ({ onBack }: StudentAuthProps) => {
  return <AuthForm onBack={onBack} userType="student" />;
};

export default StudentAuth;
