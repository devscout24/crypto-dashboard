import { useState } from "react";
import { useSSE } from "@/hooks/useSSE";
import { useCryptoData } from "@/hooks/useCryptoData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SSETestPanel() {
  const { isConnected, error, reconnect } = useSSE();
  const { data: cryptoData } = useCryptoData({ enableRealtime: true });
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTestResult, setServiceTestResult] = useState<string>("");

  const testSSEService = async () => {
    setIsLoading(true);
    setServiceTestResult("");
    
    try {
      const baseURL = import.meta.env.VITE_APP_API_URL || "http://172.16.100.26:5050";
      const response = await fetch(`${baseURL}/api/v1/sse/test`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setServiceTestResult(`✅ SSE service is running! Connected clients: ${result.connectedClients}`);
      } else {
        setServiceTestResult(`❌ SSE service error: ${result.message}`);
      }
    } catch (error) {
      setServiceTestResult(`❌ Error testing SSE service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerTestData = async () => {
    setIsLoading(true);
    setTestResult("");
    
    try {
      const baseURL = import.meta.env.VITE_APP_API_URL || "http://172.16.100.26:5050";
      const response = await fetch(`${baseURL}/api/v1/sse/test-send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTestResult(`✅ Test data sent successfully! Connected clients: ${result.connectedClients}`);
      } else {
        setTestResult(`❌ Failed to send test data: ${result.message}`);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          SSE Test Panel
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Connection Status:</strong> {isConnected ? "✅ Connected" : "❌ Disconnected"}
          </div>
          <div>
            <strong>Last Update:</strong> {cryptoData?.last_updated ? new Date(cryptoData.last_updated).toLocaleTimeString() : "Never"}
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testSSEService} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? "Testing..." : "Test SSE Service"}
          </Button>
          <Button 
            onClick={triggerTestData} 
            disabled={isLoading || !isConnected}
            variant="outline"
          >
            {isLoading ? "Sending..." : "Send Test Data"}
          </Button>
          <Button 
            onClick={reconnect} 
            disabled={isConnected}
            variant="outline"
          >
            Reconnect
          </Button>
        </div>
        
        {serviceTestResult && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
            <strong>Service Test:</strong> {serviceTestResult}
          </div>
        )}
        
        {testResult && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            <strong>Data Test:</strong> {testResult}
          </div>
        )}
        
        {cryptoData && (
          <div className="text-xs text-gray-600">
            <strong>Current Data:</strong>
            <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-32">
              {JSON.stringify(cryptoData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
