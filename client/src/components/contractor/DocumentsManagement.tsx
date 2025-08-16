import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Calendar, AlertTriangle, CheckCircle, XCircle, Award, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Document {
  id: string;
  name: string;
  type: 'License' | 'Certification' | 'Insurance' | 'Background Check' | 'Resume' | 'Portfolio' | 'Training Certificate' | 'Reference Letter';
  file_name: string;
  file_size: number;
  file_url?: string;
  upload_date: string;
  expiration_date?: string;
  status: 'Valid' | 'Expired' | 'Expiring Soon' | 'Pending Review' | 'Rejected';
  verification_status: 'Unverified' | 'Verified' | 'Needs Update';
  issued_by?: string;
  certificate_number?: string;
  notes?: string;
  tags: string[];
  required_for_roles: string[];
}

interface DocumentCategory {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  required: boolean;
  documents: Document[];
}

interface DocumentsManagementProps {
  onDocumentUpload?: (document: Document) => void;
}

export const DocumentsManagement: React.FC<DocumentsManagementProps> = ({
  onDocumentUpload
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'Certification' as Document['type'],
    file: null as File | null,
    expiration_date: '',
    issued_by: '',
    certificate_number: '',
    notes: '',
    tags: [] as string[]
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDocuments: Document[] = [
        {
          id: 'doc-1',
          name: 'RN License',
          type: 'License',
          file_name: 'rn_license_2024.pdf',
          file_size: 2048000,
          file_url: '/documents/rn_license_2024.pdf',
          upload_date: '2024-01-15T10:00:00Z',
          expiration_date: '2025-12-31',
          status: 'Valid',
          verification_status: 'Verified',
          issued_by: 'State Board of Nursing',
          certificate_number: 'RN-2024-5678',
          tags: ['Medical', 'Required'],
          required_for_roles: ['Postpartum Care', 'Medical Care']
        },
        {
          id: 'doc-2',
          name: 'CPR Certification',
          type: 'Certification',
          file_name: 'cpr_cert_2024.pdf',
          file_size: 1024000,
          file_url: '/documents/cpr_cert_2024.pdf',
          upload_date: '2024-03-20T14:30:00Z',
          expiration_date: '2025-09-15',
          status: 'Expiring Soon',
          verification_status: 'Verified',
          issued_by: 'American Heart Association',
          certificate_number: 'CPR-AHA-2024-1234',
          notes: 'Need to renew within next 60 days',
          tags: ['Safety', 'Required'],
          required_for_roles: ['All Positions']
        },
        {
          id: 'doc-3',
          name: 'IBCLC Certification',
          type: 'Certification',
          file_name: 'ibclc_certification.pdf',
          file_size: 1536000,
          file_url: '/documents/ibclc_certification.pdf',
          upload_date: '2023-11-10T09:15:00Z',
          expiration_date: '2026-07-31',
          status: 'Valid',
          verification_status: 'Verified',
          issued_by: 'International Board of Lactation Consultant Examiners',
          certificate_number: 'IBCLC-L-123456',
          tags: ['Lactation', 'Specialized'],
          required_for_roles: ['Lactation Support']
        },
        {
          id: 'doc-4',
          name: 'Professional Liability Insurance',
          type: 'Insurance',
          file_name: 'liability_insurance_2024.pdf',
          file_size: 3072000,
          file_url: '/documents/liability_insurance_2024.pdf',
          upload_date: '2024-01-01T08:00:00Z',
          expiration_date: '2024-12-31',
          status: 'Expired',
          verification_status: 'Needs Update',
          issued_by: 'Healthcare Providers Insurance',
          notes: 'Insurance policy expired - need to upload renewed policy',
          tags: ['Insurance', 'Required'],
          required_for_roles: ['All Positions']
        },
        {
          id: 'doc-5',
          name: 'Background Check',
          type: 'Background Check',
          file_name: 'background_check_2024.pdf',
          file_size: 512000,
          file_url: '/documents/background_check_2024.pdf',
          upload_date: '2024-02-28T16:20:00Z',
          status: 'Valid',
          verification_status: 'Verified',
          issued_by: 'SecureCheck Services',
          tags: ['Security', 'Required'],
          required_for_roles: ['All Positions']
        },
        {
          id: 'doc-6',
          name: 'Resume - Updated 2024',
          type: 'Resume',
          file_name: 'resume_2024_updated.pdf',
          file_size: 256000,
          upload_date: '2024-07-15T11:45:00Z',
          status: 'Valid',
          verification_status: 'Unverified',
          notes: 'Updated with recent postpartum care experience',
          tags: ['Profile', 'Current'],
          required_for_roles: ['All Positions']
        }
      ];

      setDocuments(mockDocuments);
      
      // Organize documents into categories
      const documentCategories: DocumentCategory[] = [
        {
          name: 'Licenses & Certifications',
          description: 'Professional licenses and certifications',
          icon: Award,
          color: 'bg-luxury/10 text-luxury',
          required: true,
          documents: mockDocuments.filter(d => d.type === 'License' || d.type === 'Certification')
        },
        {
          name: 'Insurance & Coverage',
          description: 'Insurance policies and coverage documents',
          icon: Shield,
          color: 'bg-blue-100 text-blue-600',
          required: true,
          documents: mockDocuments.filter(d => d.type === 'Insurance')
        },
        {
          name: 'Background & Security',
          description: 'Background checks and security clearances',
          icon: CheckCircle,
          color: 'bg-green-100 text-green-600',
          required: true,
          documents: mockDocuments.filter(d => d.type === 'Background Check')
        },
        {
          name: 'Profile & Portfolio',
          description: 'Resume, portfolio, and reference letters',
          icon: FileText,
          color: 'bg-purple-100 text-purple-600',
          required: false,
          documents: mockDocuments.filter(d => d.type === 'Resume' || d.type === 'Portfolio' || d.type === 'Reference Letter')
        }
      ];

      setCategories(documentCategories);
      setError(null);
    } catch {
      setError('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file, name: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.name.trim()) {
      setError('Please provide a file and document name');
      return;
    }

    setUploadingDocument(true);
    setError(null);

    try {
      // Mock upload logic
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: uploadForm.name,
        type: uploadForm.type,
        file_name: uploadForm.file.name,
        file_size: uploadForm.file.size,
        upload_date: new Date().toISOString(),
        expiration_date: uploadForm.expiration_date || undefined,
        status: 'Pending Review',
        verification_status: 'Unverified',
        issued_by: uploadForm.issued_by || undefined,
        certificate_number: uploadForm.certificate_number || undefined,
        notes: uploadForm.notes || undefined,
        tags: uploadForm.tags.length > 0 ? uploadForm.tags : ['New Upload'],
        required_for_roles: ['All Positions']
      };

      setDocuments(prev => [...prev, newDocument]);
      
      // Update categories
      const updatedCategories = categories.map(category => {
        if (
          (newDocument.type === 'License' || newDocument.type === 'Certification') && category.name === 'Licenses & Certifications' ||
          newDocument.type === 'Insurance' && category.name === 'Insurance & Coverage' ||
          newDocument.type === 'Background Check' && category.name === 'Background & Security' ||
          (newDocument.type === 'Resume' || newDocument.type === 'Portfolio' || newDocument.type === 'Reference Letter') && category.name === 'Profile & Portfolio'
        ) {
          return {
            ...category,
            documents: [...category.documents, newDocument]
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);

      if (onDocumentUpload) {
        onDocumentUpload(newDocument);
      }

      // Reset form
      setUploadForm({
        name: '',
        type: 'Certification',
        file: null,
        expiration_date: '',
        issued_by: '',
        certificate_number: '',
        notes: '',
        tags: []
      });

      setShowUploadModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setUploadingDocument(false);
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Valid': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-orange-100 text-orange-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'Valid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Expired': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Expiring Soon': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Pending Review': return <Eye className="h-4 w-4 text-yellow-600" />;
      case 'Rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getVerificationIcon = (verification: Document['verification_status']) => {
    switch (verification) {
      case 'Verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Needs Update': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expiry = new Date(expirationDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays > 0;
  };

  if (isLoading) {
    return (
      <div className="healthcare-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-accent/20 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-accent/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="healthcare-card p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <XCircle className="h-5 w-5" />
          <span className="font-body">{error}</span>
        </div>
        <button
          onClick={loadDocuments}
          className="healthcare-button-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="healthcare-heading text-lg font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-luxury" />
          Document Management ({documents.length})
        </h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="healthcare-button-primary flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: documents.length, color: 'text-primary' },
          { label: 'Expired', value: documents.filter(d => d.status === 'Expired').length, color: 'text-red-600' },
          { label: 'Expiring Soon', value: documents.filter(d => d.status === 'Expiring Soon').length, color: 'text-orange-600' },
          { label: 'Verified', value: documents.filter(d => d.verification_status === 'Verified').length, color: 'text-green-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-background p-4 rounded-lg text-center">
            <div className={`font-heading text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="font-ui text-xs text-primary/60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Urgent Actions */}
      {(documents.some(d => d.status === 'Expired') || documents.some(d => d.status === 'Expiring Soon')) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-heading font-semibold text-red-800">Urgent Action Required</h4>
          </div>
          <div className="space-y-2">
            {documents.filter(d => d.status === 'Expired').map(doc => (
              <p key={doc.id} className="font-body text-red-700 text-sm">
                • <strong>{doc.name}</strong> has expired and needs to be renewed immediately
              </p>
            ))}
            {documents.filter(d => d.status === 'Expiring Soon').map(doc => (
              <p key={doc.id} className="font-body text-orange-700 text-sm">
                • <strong>{doc.name}</strong> expires on {formatDate(doc.expiration_date!)} - please renew soon
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Document Categories */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name} className="healthcare-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading text-lg font-semibold text-primary">
                    {category.name}
                  </h4>
                  <p className="font-body text-primary/60 text-sm">{category.description}</p>
                </div>
              </div>
              {category.required && (
                <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-ui font-medium">
                  Required
                </span>
              )}
            </div>

            <div className="space-y-3">
              {category.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <p className="font-body text-primary/60">No documents in this category yet</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="healthcare-button-secondary mt-2 text-sm"
                  >
                    Upload Document
                  </button>
                </div>
              ) : (
                category.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center space-y-1">
                        {getStatusIcon(document.status)}
                        {getVerificationIcon(document.verification_status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-ui font-medium text-primary">{document.name}</h5>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${getStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                          {document.verification_status === 'Verified' && (
                            <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-ui font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-primary/60">
                          <span>{formatFileSize(document.file_size)}</span>
                          <span>Uploaded: {formatDate(document.upload_date)}</span>
                          {document.expiration_date && (
                            <span className={isExpiringSoon(document.expiration_date) ? 'text-orange-600' : ''}>
                              Expires: {formatDate(document.expiration_date)}
                            </span>
                          )}
                          {document.issued_by && (
                            <span>Issued by: {document.issued_by}</span>
                          )}
                        </div>

                        {document.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {document.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 bg-accent/10 text-primary/70 rounded-full text-xs font-ui"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowDocumentViewer(true);
                        }}
                        className="healthcare-button-secondary text-sm flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      
                      {document.file_url && (
                        <button className="healthcare-button-secondary text-sm flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      )}
                      
                      {document.status === 'Expired' || document.status === 'Expiring Soon' && (
                        <button className="healthcare-button-primary text-sm">
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <h2 className="font-heading text-xl font-semibold text-primary">
                Upload Document
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="font-body text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., CPR Certification, RN License"
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                  required
                />
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Document Type *
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value as Document['type'] }))}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                >
                  <option value="Certification">Certification</option>
                  <option value="License">License</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Background Check">Background Check</option>
                  <option value="Resume">Resume</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Training Certificate">Training Certificate</option>
                  <option value="Reference Letter">Reference Letter</option>
                </select>
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  File Upload *
                </label>
                <div className="border-2 border-dashed border-accent/30 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-primary/40 mx-auto mb-2" />
                  <div className="space-y-1">
                    <p className="font-body text-primary/70">
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="font-body text-xs text-primary/50">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui font-medium text-primary mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={uploadForm.expiration_date}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, expiration_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                  />
                </div>

                <div>
                  <label className="block font-ui font-medium text-primary mb-2">
                    Issued By
                  </label>
                  <input
                    type="text"
                    value={uploadForm.issued_by}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, issued_by: e.target.value }))}
                    placeholder="e.g., American Heart Association"
                    className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Certificate Number
                </label>
                <input
                  type="text"
                  value={uploadForm.certificate_number}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, certificate_number: e.target.value }))}
                  placeholder="Certificate or license number"
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                />
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Notes
                </label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about this document..."
                  rows={3}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-body text-primary/70 hover:text-primary transition-colors"
                  disabled={uploadingDocument}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDocument || !uploadForm.file || !uploadForm.name.trim()}
                  className="healthcare-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingDocument ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{uploadingDocument ? 'Uploading...' : 'Upload Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {selectedDocument.name}
                </h2>
                <p className="font-body text-primary/70">
                  {selectedDocument.type} • {formatFileSize(selectedDocument.file_size)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDocumentViewer(false);
                  setSelectedDocument(null);
                }}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-ui text-sm text-primary/70">Status:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedDocument.status)}
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-ui text-sm text-primary/70">Verification:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getVerificationIcon(selectedDocument.verification_status)}
                      <span className="font-body text-primary">{selectedDocument.verification_status}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-ui text-sm text-primary/70">Uploaded:</span>
                    <p className="font-body text-primary">{formatDate(selectedDocument.upload_date)}</p>
                  </div>

                  {selectedDocument.expiration_date && (
                    <div>
                      <span className="font-ui text-sm text-primary/70">Expires:</span>
                      <p className={`font-body ${isExpiringSoon(selectedDocument.expiration_date) ? 'text-orange-600' : 'text-primary'}`}>
                        {formatDate(selectedDocument.expiration_date)}
                      </p>
                    </div>
                  )}
                </div>

                {selectedDocument.issued_by && (
                  <div>
                    <span className="font-ui text-sm text-primary/70">Issued By:</span>
                    <p className="font-body text-primary">{selectedDocument.issued_by}</p>
                  </div>
                )}

                {selectedDocument.certificate_number && (
                  <div>
                    <span className="font-ui text-sm text-primary/70">Certificate Number:</span>
                    <p className="font-body text-primary">{selectedDocument.certificate_number}</p>
                  </div>
                )}

                {selectedDocument.notes && (
                  <div>
                    <span className="font-ui text-sm text-primary/70">Notes:</span>
                    <p className="font-body text-primary">{selectedDocument.notes}</p>
                  </div>
                )}

                <div>
                  <span className="font-ui text-sm text-primary/70">Required for:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDocument.required_for_roles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 bg-luxury/10 text-luxury rounded-full text-xs font-ui"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedDocument.tags.length > 0 && (
                  <div>
                    <span className="font-ui text-sm text-primary/70">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDocument.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 bg-accent/10 text-primary/70 rounded-full text-xs font-ui"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-accent/20">
                {selectedDocument.file_url && (
                  <button className="healthcare-button-secondary flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                )}
                
                <button className="healthcare-button-secondary flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Update</span>
                </button>
                
                <button className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};