import { Button as MUIButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';

import { account } from '@/lib/client';
import clsxm from '@/lib/clsxm';

import useAuthStore from '@/store/useAuthStore';

import withAuth from '@/hoc/withAuth';

type LoginData = {
  email: string;
  password: string;
};

export default withAuth(LoginPage, 'auth');
function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginData>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      setLoginError('');
      setIsLoading(true);
      await account.createEmailSession(data.email, data.password);
      const user = await account.get();
      const tokenRes = await account.createJWT();
      login(user as any, tokenRes.jwt);
    } catch (error: any) {
      setLoginError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#f3f4f6]'>
      <div className='d-flex container mx-auto h-[50px] pt-5'>
        <div className='relative mr-auto h-full w-[200px] object-scale-down'>
          <Image src='/logo.svg' alt='logo' fill />
        </div>
      </div>

      <main className='mt-10 sm:px-4 sm:pb-4'>
        <div className='flex'>
          <div className='mx-auto mt-5 rounded-lg bg-white px-6 py-10 shadow-lg sm:w-full md:w-[450px]'>
            <div>
              <h1 className=' text-center text-2xl font-bold leading-[150%]'>
                Sign In to your account
              </h1>
              <p className='mt-4 text-center text-sm font-medium leading-[150%] text-gray-500'>
                Please enter your email and password to login to your account.
              </p>
            </div>
            {loginError && (
              <div
                className='my-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
                role='alert'
              >
                {loginError}
              </div>
            )}

            <div className=''>
              <div className='mt-6'>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div>
                      <label className='text-sm font-medium leading-[150%]'>
                        Email
                      </label>
                      <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className=' mt-2 w-full'
                            id='email'
                            placeholder='Email'
                            type='email'
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='start'>
                                  <HiOutlineMail
                                    style={{
                                      color: '#9CA3AF',
                                      fontSize: '1.25rem',
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        rules={{
                          required: 'Email is required',
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message:
                              'Entered value does not match email format',
                          },
                        }}
                      />
                    </div>
                    {errors.email && (
                      <div className='text-sm text-red-500'>
                        {errors.email.message}
                      </div>
                    )}

                    <div>
                      <label className='text-sm font-medium leading-[150%]'>
                        Password
                      </label>
                      <Controller
                        name='password'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className='mt-2 w-full'
                            id='password'
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position='start'
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <BiHide
                                      style={{
                                        color: '#9CA3AF',
                                        fontSize: '1.25rem',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  ) : (
                                    <BiShow
                                      style={{
                                        color: '#9CA3AF',
                                        fontSize: '1.25rem',
                                        cursor: 'pointer',
                                      }}
                                    />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <MUIButton
                        type='submit'
                        variant='contained'
                        className={clsxm(
                          'w-full text-[16px] font-semibold capitalize',
                          isLoading
                            ? 'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait'
                            : ''
                        )}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <div className='absolute left-0 right-0 text-white'>
                            <ImSpinner2 className='animate-spin' />
                          </div>
                        )}
                        Sign In
                      </MUIButton>
                    </div>
                  </form>
                </FormProvider>
              </div>
              <p className='text-primary-main mt-2 text-center text-sm font-medium leading-[150%]'>
                Forgot Password ?
              </p>
              <p className='mt-4 text-center text-sm text-gray-500'>
                Don't have an account?
                <a
                  href='#'
                  className='text-primary-main hover:text-primary-light ml-1 font-semibold leading-6'
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
