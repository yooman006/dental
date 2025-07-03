import { Stethoscope } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        
        <div className="mb-6">
          <div className="bg-blue-600 p-4 rounded-full inline-block animate-pulse">
            <Stethoscope className="h-12 w-12 text-white" />
          </div>
        </div>

        
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ENTNT Dental Center
        </h2>
        <p className="text-gray-600">{message}</p>

        
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;