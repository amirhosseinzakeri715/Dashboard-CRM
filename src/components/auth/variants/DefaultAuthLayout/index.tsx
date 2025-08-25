import authImg from '../../../../../public/logo/logo.png';
import NavLink from 'components/link/NavLink';
import Footer from 'components/footer/FooterAuthDefault';
import Image from 'next/image';
function Default(props: { maincard: JSX.Element }) {
  const { maincard } = props;
  return (
    <div className="relative flex ">
      <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[900px] lg:px-4 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1200px] xl:px-0 xl:pl-[30px]">
        <div className="mb-auto flex flex-col pl-5 pr-5 md:pl-12 md:pr-0 lg:max-w-[44%] lg:pl-0 xl:max-w-full">
          <NavLink href="/admin" className="mt-0 w-max lg:pt-10">
            <div className="mx-auto flex h-fit w-fit items-center hover:cursor-pointer">
              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z"
                  fill="#A3AED0"
                />
              </svg>
              <p className="ml-3 text-sm text-gray-600">Back to Dashboard</p>
            </div>
          </NavLink>
          {maincard}
          <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[52vw] 2xl:w-[47vw] overflow-hidden">
            <div
              // style={{ backgroundImage: authImg ? `url(${authImg})` : '' }}
              className={`absolute flex h-full w-full items-end justify-center bg-gradient-to-br from-green-400 to-green-600 bg-cover bg-center lg:rounded-bl-[100px] xl:rounded-bl-[100px]`}
            >
              <div className="relative flex h-full w-full left-1/4 top-1/3 overflow-hidden">
                <div>
                  <Image src={authImg} width={350} height={350} alt='image' className=' mx-auto bg-cover'/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Default;
