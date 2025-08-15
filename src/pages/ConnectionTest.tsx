import React from 'react';
import CatalystConnectionStatus from '../components/CatalystConnectionStatus';

const ConnectionTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">
            Healthcare Platform Connection Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify that your Snugs & Kisses healthcare authentication portal is properly 
            connected to Zoho Catalyst and ready for user authentication.
          </p>
        </div>

        <CatalystConnectionStatus />

        <div className="mt-12 text-center">
          <div className="healthcare-card p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Next Steps After Connection Test
            </h2>
            <div className="text-left space-y-3 text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">1.</span>
                <span>Ensure all connection tests pass before proceeding</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">2.</span>
                <span>Test authentication with valid healthcare portal credentials</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">3.</span>
                <span>Verify role-based dashboard routing works correctly</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 font-bold">4.</span>
                <span>Test all healthcare features and integrations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTestPage;