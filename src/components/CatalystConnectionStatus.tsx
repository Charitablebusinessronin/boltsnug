import React, { useState, useEffect } from 'react';
import { testCatalystConnection, quickTestCatalystConnection, ConnectionTestResult } from '../utils/catalystConnectionTest';

export const CatalystConnectionStatus: React.FC = () => {
  const [testResults, setTestResults] = useState<ConnectionTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [quickTestPassed, setQuickTestPassed] = useState<boolean | null>(null);

  useEffect(() => {
    // Run quick test on component mount
    runQuickTest();
  }, []);

  const runQuickTest = async () => {
    try {
      const result = await quickTestCatalystConnection();
      setQuickTestPassed(result);
    } catch (error) {
      console.error('Quick test error:', error);
      setQuickTestPassed(false);
    }
  };

  const runFullTest = async () => {
    setIsLoading(true);
    try {
      const { results, summary: testSummary } = await testCatalystConnection();
      setTestResults(results);
      setSummary(testSummary);
    } catch (error) {
      console.error('Full test error:', error);
      setSummary('❌ Connection test failed due to unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStepIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  return (
    <div className="healthcare-card p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            🏥 Catalyst Connection Status
          </h2>
          <p className="text-gray-600 mt-1">
            Healthcare Platform Authentication System
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Quick Test Status */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
            quickTestPassed === null 
              ? 'text-gray-600 bg-gray-50 border-gray-200' 
              : getStatusColor(quickTestPassed)
          }`}>
            {quickTestPassed === null && 'Testing...'}
            {quickTestPassed === true && '✅ Quick Test Passed'}
            {quickTestPassed === false && '❌ Quick Test Failed'}
          </div>
          
          <button
            onClick={runFullTest}
            disabled={isLoading}
            className="healthcare-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Testing...' : 'Run Full Test'}
          </button>
        </div>
      </div>

      {/* Quick Test Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Connection Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Project ID:</span>
            <div className="text-blue-600">
              {import.meta.env.VITE_CATALYST_PROJECT_ID ? 
                import.meta.env.VITE_CATALYST_PROJECT_ID.substring(0, 8) + '...' : 
                'Not Set'
              }
            </div>
          </div>
          <div>
            <span className="font-medium">Environment:</span>
            <div className="text-blue-600">
              {import.meta.env.VITE_ENVIRONMENT || 'Not Set'}
            </div>
          </div>
          <div>
            <span className="font-medium">App URL:</span>
            <div className="text-blue-600">
              {import.meta.env.VITE_CATALYST_APP_URL ? 
                import.meta.env.VITE_CATALYST_APP_URL.substring(0, 30) + '...' : 
                'Not Set'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Full Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            <h3 className="font-semibold text-primary mb-2">Test Summary</h3>
            <p className="text-primary">{summary}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Detailed Results</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${getStatusColor(result.success)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getStepIcon(result.success)}</span>
                    <div>
                      <h4 className="font-semibold">{result.step}</h4>
                      <p className="mt-1">{result.message}</p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm opacity-75 hover:opacity-100">
                            Show Details
                          </summary>
                          <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto max-h-32">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Ensure your <code>.env</code> file contains the required Catalyst configuration</p>
          <p>• Verify your Catalyst project ID and app URL are correct</p>
          <p>• Check browser console for any JavaScript errors</p>
          <p>• Make sure your domain is whitelisted in Catalyst settings</p>
        </div>
      </div>
    </div>
  );
};

export default CatalystConnectionStatus;