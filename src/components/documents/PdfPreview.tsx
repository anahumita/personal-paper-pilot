
import { useRef, useState, useEffect } from "react";
import { Document as ContractDocument } from "@/types";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface PdfPreviewProps {
  document: ContractDocument;
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  section: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 12,
  },
  divider: {
    borderBottom: '1 solid #E2E8F0',
    marginVertical: 15,
  },
  signature: {
    width: 200,
    height: 80,
    marginTop: 10,
  },
  signatureSection: {
    marginTop: 30,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#A0AEC0',
  },
});

// PDF Document Component
const ContractPdf = ({ document }: PdfPreviewProps) => {
  const excludeFields = ['templateId', 'name', 'signatureUrl'];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{document.name}</Text>
        
        <View style={styles.divider} />
        
        {Object.entries(document.data)
          .filter(([key]) => !excludeFields.includes(key) && document.data[key])
          .map(([key, value]) => (
            <View key={key} style={styles.section}>
              <Text style={styles.fieldLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
              </Text>
              <Text style={styles.fieldValue}>{value}</Text>
            </View>
          ))}
        
        <View style={styles.divider} />
        
        {document.data.signatureUrl && (
          <View style={styles.signatureSection}>
            <Text style={styles.fieldLabel}>Signature:</Text>
            <Image src={document.data.signatureUrl} style={styles.signature} />
          </View>
        )}
        
        <Text style={styles.pageNumber}>Page 1</Text>
      </Page>
    </Document>
  );
};

export function PdfPreview({ document }: PdfPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-96 bg-muted/20 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <PDFDownloadLink 
          document={<ContractPdf document={document} />} 
          fileName={`${document.name.replace(/\s+/g, '_')}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      
      <div className="pdf-viewer h-[600px] bg-muted/20 rounded-lg overflow-hidden">
        <PDFViewer width="100%" height="100%" className="border-none">
          <ContractPdf document={document} />
        </PDFViewer>
      </div>
    </div>
  );
}
