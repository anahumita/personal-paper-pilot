
import { useRef, useEffect, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, RefreshCw } from "lucide-react";

interface SignatureCanvasProps {
  onSigned: (signatureDataUrl: string) => void;
  initialSignature?: string;
}

export function SignatureCanvas({ onSigned, initialSignature }: SignatureCanvasProps) {
  const signatureRef = useRef<SignaturePad>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  
  useEffect(() => {
    // If there's an initial signature, show it
    if (initialSignature && signatureRef.current) {
      signatureRef.current.fromDataURL(initialSignature);
      setIsEmpty(false);
    }
  }, [initialSignature]);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataUrl = signatureRef.current.toDataURL();
      onSigned(dataUrl);
    }
  };

  const handleEnd = () => {
    if (signatureRef.current) {
      setIsEmpty(signatureRef.current.isEmpty());
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Signature</CardTitle>
        <CardDescription>Sign in the box below using your mouse or touchscreen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="signature-canvas-container border rounded-lg bg-white p-2">
          <SignaturePad
            ref={signatureRef}
            canvasProps={{
              className: "signature-canvas w-full h-40",
            }}
            onEnd={handleEnd}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleClear}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button 
          size="sm" 
          onClick={handleSave} 
          disabled={isEmpty}
        >
          <Check className="h-4 w-4 mr-2" />
          Apply Signature
        </Button>
      </CardFooter>
    </Card>
  );
}
