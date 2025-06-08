import { useFormik } from 'formik';
import React, { useContext, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GoogleButton from '@/components/GoogleButton';
import Logo from '@/components/Logo';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsIFrame } from '@/hooks/useIsIFrame';

const LoginPage = () => {
  const router = useRouter();
  const { initializing, signIn } = useContext(AuthContext);
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isIframe } = useIsIFrame();
  const { toast } = useToast();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { email, password } = formik.values;
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email or username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Must be at least 4 characters")
      .max(40, "Must not exceed 40 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-5">
          <div className="w-full flex justify-center cursor-pointer" onClick={() => router.push("/")}>
            <Logo />
          </div>

          <Card className="w-full" onKeyDown={handleKeyPress}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-xl sm:text-2xl">Log in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <GoogleButton />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/magic-link-login');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Continue with Magic Link
                </Button>
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center w-full">
                    <Separator className="flex-1" />
                    <span className="mx-3 text-muted-foreground text-xs sm:text-sm font-semibold whitespace-nowrap">or</span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="text-center text-xs sm:text-sm text-muted-foreground">Enter your credentials</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">Email or Username</Label>
                        <Input
                          id="email"
                          name="email"
                          type="text"
                          placeholder="Enter your email or username"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="input-mobile"
                        />
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-destructive text-xs">{formik.errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPw ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="input-mobile pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center h-full"
                            onClick={() => setShowPw(!showPw)}
                          >
                            {showPw
                              ? <FaEye className="text-muted-foreground w-4 h-4" />
                              : <FaEyeSlash className="text-muted-foreground w-4 h-4" />
                            }
                          </Button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                          <p className="text-destructive text-xs">{formik.errors.password}</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span>Need an account?</span>
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-xs sm:text-sm"
                            onClick={() => router.push('/signup')}
                          >
                            Sign up
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-xs sm:text-sm self-start sm:self-center"
                          onClick={() => router.push('/forgot-password')}
                        >
                          Forgot password?
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="button-mobile w-full mt-2"
                    disabled={isLoading || initializing || !formik.values.email || !formik.values.password || !formik.isValid}
                    onClick={handleLogin}
                  >
                    {isLoading ? 'Signing in...' : 'Continue'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;