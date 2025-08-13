import Default from 'components/auth/variants/DefaultAuthLayout';
import SignUpForm from 'components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <Default
      maincard={
        <>
          <SignUpForm />
        </>
      }
    />
  );
} 