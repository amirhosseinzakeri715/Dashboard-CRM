import Image from 'next/image';
import logo from '../../../../public/logo/logo2.png';
import Default from 'components/auth/variants/DefaultAuthLayout';
import SignInForm from 'components/auth/SignInForm';

export default function SignInPage() {
  return (
    <Default
      maincard={
        <>
          <SignInForm />
        </>
      }
    />
  );
}
