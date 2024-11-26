import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BarChart2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface FileData {
  file: File;
  contents: string[][];
  analysis: {
    rowCount: number;
    columnCount: number;
    averages: number[];
  };
}

export const TrendAnalysis = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const analyzeData = (contents: string[][]) => {
    const columnCount = contents[0]?.length || 0;
    const rowCount = contents.length;
    
    // Calculate averages for each numeric column
    const averages = Array(columnCount).fill(0);
    let validRows = Array(columnCount).fill(0);
    
    contents.forEach((row) => {
      row.forEach((cell, index) => {
        const num = parseFloat(cell);
        if (!isNaN(num)) {
          averages[index] += num;
          validRows[index]++;
        }
      });
    });
    
    return {
      rowCount,
      columnCount,
      averages: averages.map((sum, index) => 
        validRows[index] ? Number((sum / validRows[index]).toFixed(2)) : 0
      ),
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsLoading(true);
      
      try {
        const newFiles: FileData[] = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const text = await file.text();
          const contents = text.split('\n')
            .map(row => row.split(','))
            .filter(row => row.some(cell => cell.trim())); // Remove empty rows
          
          const analysis = analyzeData(contents);
          
          newFiles.push({
            file,
            contents,
            analysis,
          });
        }
        
        setUploadedFiles(prev => [...prev, ...newFiles]);
        
        toast({
          title: "Files uploaded",
          description: `Successfully loaded ${files.length} file(s)`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to read one or more files",
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
              <span>{isLoading ? "Loading..." : "Upload CSV Files"}</span>
            </Button>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </Card>

      {uploadedFiles.map((fileData, fileIndex) => (
        <Card key={fileIndex} className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            File: {fileData.file.name}
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <p><strong>Size:</strong> {Math.round(fileData.file.size / 1024)} KB</p>
              <p><strong>Rows:</strong> {fileData.analysis.rowCount}</p>
              <p><strong>Columns:</strong> {fileData.analysis.columnCount}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Column Averages</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column</TableHead>
                    <TableHead>Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileData.analysis.averages.map((avg, i) => (
                    <TableRow key={i}>
                      <TableCell>Column {i + 1}</TableCell>
                      <TableCell>{avg}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    {fileData.contents.slice(0, 5).map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell key={j}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {fileData.contents.length > 5 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing first 5 rows of {fileData.contents.length} total rows
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TrendAnalysis;