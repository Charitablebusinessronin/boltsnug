// Catalyst Connection Test Utility for Healthcare Platform
// Tests embedded auth initialization and connection

export interface ConnectionTestResult {
  success: boolean;
  step: string;
  message: string;
  details?: unknown;
}

export class CatalystConnectionTest {
  private testResults: ConnectionTestResult[] = [];

  public async runFullConnectionTest(): Promise<{
    success: boolean;
    results: ConnectionTestResult[];
    summary: string;
  }> {
    console.log('🏥 Starting Catalyst Healthcare Platform Connection Test...');
    this.testResults = [];

    // Test 1: Environment Variables
    await this.testEnvironmentVariables();

    // Test 2: SDK Availability
    await this.testSDKAvailability();

    // Test 3: Embedded Auth Script Loading
    await this.testEmbeddedAuthScript();

    // Test 4: Basic Authentication Test (Mock)
    await this.testBasicAuthFlow();

    const success = this.testResults.every(result => result.success);
    const summary = this.generateSummary();

    console.log(success ? '✅ All tests passed!' : '❌ Some tests failed!');
    return {
      success,
      results: this.testResults,
      summary
    };
  }

  private async testEnvironmentVariables(): Promise<void> {
    try {
      const projectId = import.meta.env.VITE_CATALYST_PROJECT_ID;
      const environment = import.meta.env.VITE_ENVIRONMENT;
      const appUrl = import.meta.env.VITE_CATALYST_APP_URL;

      if (!projectId || !environment || !appUrl) {
        this.testResults.push({
          success: false,
          step: 'Environment Variables',
          message: 'Missing required environment variables',
          details: {
            VITE_CATALYST_PROJECT_ID: projectId ? '✅ Set' : '❌ Missing',
            VITE_ENVIRONMENT: environment ? '✅ Set' : '❌ Missing',
            VITE_CATALYST_APP_URL: appUrl ? '✅ Set' : '❌ Missing'
          }
        });
        return;
      }

      this.testResults.push({
        success: true,
        step: 'Environment Variables',
        message: 'All required environment variables are configured',
        details: {
          projectId: projectId.substring(0, 5) + '...',
          environment,
          appUrl: appUrl.substring(0, 30) + '...'
        }
      });
    } catch (error) {
      this.testResults.push({
        success: false,
        step: 'Environment Variables',
        message: 'Error checking environment variables',
        details: error
      });
    }
  }

  private async testSDKAvailability(): Promise<void> {
    try {
      // Wait for SDK to load with timeout
      const sdkAvailable = await this.waitForSDK(5000);
      
      if (sdkAvailable && window.catalyst) {
        this.testResults.push({
          success: true,
          step: 'SDK Availability',
          message: 'Catalyst SDK loaded successfully',
          details: {
            hasAuth: !!window.catalyst.auth,
            hasFunction: !!window.catalyst.function,
            authMethods: window.catalyst.auth ? Object.keys(window.catalyst.auth) : []
          }
        });
      } else {
        this.testResults.push({
          success: false,
          step: 'SDK Availability',
          message: 'Catalyst SDK not available',
          details: {
            windowCatalyst: !!window.catalyst,
            timeout: '5000ms'
          }
        });
      }
    } catch (error) {
      this.testResults.push({
        success: false,
        step: 'SDK Availability',
        message: 'Error checking SDK availability',
        details: error
      });
    }
  }

  private async testEmbeddedAuthScript(): Promise<void> {
    try {
      const appUrl = import.meta.env.VITE_CATALYST_APP_URL;
      const expectedScriptSrc = `${appUrl.replace(/\/$/, '')}/__catalyst/sdk/init.js`;
      
      const scripts = Array.from(document.querySelectorAll('script'));
      const initScript = scripts.find(script => script.src.includes('__catalyst/sdk/init.js'));

      if (initScript) {
        this.testResults.push({
          success: true,
          step: 'Embedded Auth Script',
          message: 'Embedded auth script loaded successfully',
          details: {
            scriptSrc: initScript.src,
            expectedSrc: expectedScriptSrc,
            scriptLoaded: !initScript.hasAttribute('data-failed')
          }
        });
      } else {
        this.testResults.push({
          success: false,
          step: 'Embedded Auth Script',
          message: 'Embedded auth script not found',
          details: {
            expectedSrc: expectedScriptSrc,
            allScripts: scripts.map(s => s.src).filter(src => src.includes('catalyst'))
          }
        });
      }
    } catch (error) {
      this.testResults.push({
        success: false,
        step: 'Embedded Auth Script',
        message: 'Error checking embedded auth script',
        details: error
      });
    }
  }

  private async testBasicAuthFlow(): Promise<void> {
    try {
      if (!window.catalyst?.auth) {
        this.testResults.push({
          success: false,
          step: 'Basic Auth Flow',
          message: 'Cannot test auth flow - SDK not available'
        });
        return;
      }

      // Test that auth methods exist and are functions
      const authMethods = {
        signIn: typeof window.catalyst.auth.signIn === 'function',
        signOut: typeof window.catalyst.auth.signOut === 'function',
        getCurrentUser: typeof window.catalyst.auth.getCurrentUser === 'function'
      };

      const allMethodsAvailable = Object.values(authMethods).every(Boolean);

      this.testResults.push({
        success: allMethodsAvailable,
        step: 'Basic Auth Flow',
        message: allMethodsAvailable 
          ? 'All auth methods are available and ready for testing'
          : 'Some auth methods are missing or not functions',
        details: {
          ...authMethods,
          note: 'Authentication flow ready for manual testing with valid credentials'
        }
      });

    } catch (error) {
      this.testResults.push({
        success: false,
        step: 'Basic Auth Flow',
        message: 'Error testing auth flow readiness',
        details: error
      });
    }
  }

  private waitForSDK(timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkSDK = () => {
        if (window.catalyst && window.catalyst.auth) {
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          resolve(false);
        } else {
          setTimeout(checkSDK, 100);
        }
      };
      
      checkSDK();
    });
  }

  private generateSummary(): string {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.success).length;
    const failed = total - passed;

    if (failed === 0) {
      return `🎉 All ${total} connection tests passed! Healthcare platform authentication is ready.`;
    } else {
      return `⚠️  ${passed}/${total} tests passed. ${failed} issues need attention before platform can authenticate users.`;
    }
  }

  public async runQuickTest(): Promise<boolean> {
    console.log('🏥 Quick Catalyst Connection Test...');
    
    // Quick checks
    const hasEnvVars = !!(
      import.meta.env.VITE_CATALYST_PROJECT_ID && 
      import.meta.env.VITE_CATALYST_APP_URL
    );
    
    const hasSDK = await this.waitForSDK(2000);
    
    const result = hasEnvVars && hasSDK;
    console.log(result ? '✅ Quick test passed' : '❌ Quick test failed');
    
    return result;
  }
}

// Export singleton instance
export const catalystConnectionTest = new CatalystConnectionTest();

// Convenience functions
export const testCatalystConnection = () => catalystConnectionTest.runFullConnectionTest();
export const quickTestCatalystConnection = () => catalystConnectionTest.runQuickTest();