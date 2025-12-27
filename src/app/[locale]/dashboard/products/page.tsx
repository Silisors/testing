"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProductsPage() {
    const t = useTranslations();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel") {
            setFile(file);
            setStatus('idle');
        } else {
            alert("Please upload a valid Excel file (.xlsx or .xls)");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');

        // Mock upload delay
        setTimeout(() => {
            setStatus('success');
            setFile(null);
            setTimeout(() => setStatus('idle'), 3000);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("nav.products")}</h1>
                <p className="text-muted-foreground">
                    Manage your product catalog and inventory
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary" />
                            Upload Products via Excel
                        </CardTitle>
                        <CardDescription>
                            Bulk upload your products using our standard template
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div
                            className={`
                                border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
                                ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileSpreadsheet className="w-12 h-12 text-green-600" />
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-12 h-12 text-muted-foreground" />
                                    <p className="font-medium">Click to upload or drag and drop</p>
                                    <p className="text-sm text-muted-foreground">Excel files only (.xlsx, .xls)</p>
                                </div>
                            )}
                        </div>

                        {status === 'success' && (
                            <Alert className="bg-green-50 text-green-800 border-green-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>
                                    Products uploaded successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            className="w-full"
                            disabled={!file || status === 'uploading'}
                            onClick={handleUpload}
                        >
                            {status === 'uploading' ? 'Uploading...' : 'Upload Products'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            Instructions & Template
                        </CardTitle>
                        <CardDescription>
                            Ensure your Excel file follows this format
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Required Columns:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Name:</strong> Product name (e.g., "Office Chair")</li>
                                <li><strong>Price:</strong> Unit price (numeric)</li>
                                <li><strong>Currency:</strong> ISO code (e.g., USD, COP)</li>
                                <li><strong>Brand:</strong> Manufacturer brand</li>
                                <li><strong>SKU:</strong> Stock Keeping Unit (Unique ID)</li>
                                <li><strong>Stock:</strong> Available quantity</li>
                                <li><strong>Category:</strong> Product category</li>
                                <li><strong>Description:</strong> Detailed product description</li>
                            </ul>

                            <h3 className="font-semibold pt-2">Optional Columns:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Images:</strong> URL to product image</li>
                                <li><strong>Warranty:</strong> Warranty period (e.g., "1 year")</li>
                                <li><strong>Credit:</strong> Available credit terms</li>
                            </ul>
                        </div>

                        <Button variant="outline" className="w-full gap-2 mt-4">
                            <Download className="w-4 h-4" />
                            Download Template
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
