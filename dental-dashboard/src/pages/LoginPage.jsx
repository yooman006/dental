import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
   const [isSignUp, setIsSignUp] = useState(false);
  const { isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">


                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full mr-3">
                            <Stethoscope className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                ENTNT Dental
                            </h1>
                            <p className="text-blue-600 font-medium">Management System</p>
                        </div>
                    </div>


                    <p className="text-gray-600">
                        {isSignUp ? 'Create your account to get started' : 'Welcome back! Please sign in to continue'}
                    </p>
                </div>

                
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                      
                        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setIsSignUp(false)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isSignUp
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Sign In
                            </button>

                        </div>


                        {<LoginForm />}
                    </div>



                </div>
            </div>
        </div>
    );
};

export default LoginPage;