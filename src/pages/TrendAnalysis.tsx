import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const TrendAnalysis = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContents, setFileContents] = useState<string[][]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setUploadedFile(file);
      
      try {
        const text = await file.text();
        const rows = text.split('\n').map(row => row.split(','));
        setFileContents(rows);
        
        toast({
          title: "File uploaded",
          description: `Successfully loaded ${file.name}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Trend Analysis</h1>
      
      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Data</h2>
          <p className="text-muted-foreground">
            Upload your CSV files containing water level data for trend analysis.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => document.getElementById("csv-upload")?.click()}
              className="flex items-center space-x-2"
              disabled={isLoading}
            >
              <Upload className="w-4 h-4" />
              <span>{isLoading ? "Loading..." : "Upload CSV"}</span>
            </Button>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </Card>

      {uploadedFile && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded File</h2>
          <div className="space-y-2">
            <p><strong>File name:</strong> {uploadedFile.name}</p>
            <p><strong>Size:</strong> {Math.round(uploadedFile.size / 1024)} KB</p>
          </div>
          
          {fileContents.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    {fileContents.slice(0, 5).map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {fileContents.length > 5 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing first 5 rows of {fileContents.length} total rows
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default TrendAnalysis;