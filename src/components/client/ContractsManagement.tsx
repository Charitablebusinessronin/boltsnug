import React, { useState, useEffect } from 'react';
import { FileText, Download, Edit, Eye, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, Pen, Send } from 'lucide-react';
import { catalystClientFunctions } from '../../lib/catalyst-functions/client-functions';
import { useAuth } from '../../hooks/useAuth';

interface Contract {
  id: string;
  contract_number: string;
  client_id: string;
  caregiver_id?: string;
  caregiver_name?: string;
  service_type: string;
  contract_type: 'Service Agreement' | 'Care Plan' | 'Consulting Agreement' | 'Training Agreement';
  status: 'Draft' | 'Pending Review' | 'Awaiting Signature' | 'Signed' | 'Active' | 'Completed' | 'Cancelled';
  terms: {
    start_date: string;
    end_date?: string;
    hours_per_week: number;
    hourly_rate: number;
    total_estimated_cost: number;
  };
  services_included: string[];
  special_provisions?: string[];
  cancellation_policy: string;
  payment_terms: string;
  created_date: string;
  last_updated: string;
  signed_date?: string;
  contract_url?: string;
  signed_contract_url?: string;
}

interface ContractsManagementProps {
  onNewContract?: () => void;
}

export const ContractsManagement: React.FC<ContractsManagementProps> = ({
  onNewContract
}) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [isSigningContract, setIsSigningContract] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockContracts: Contract[] = [
        {
          id: 'contract-1',
          contract_number: 'SNK-2025-001',
          client_id: user?.id || 'client-123',
          caregiver_id: 'caregiver-1',
          caregiver_name: 'Sarah Martinez',
          service_type: 'Postpartum Care',
          contract_type: 'Service Agreement',
          status: 'Awaiting Signature',
          terms: {
            start_date: '2025-08-20',
            end_date: '2025-11-20',
            hours_per_week: 30,
            hourly_rate: 35,
            total_estimated_cost: 13650
          },
          services_included: [
            'Postpartum care and support',
            'Newborn care assistance',
            'Breastfeeding support',
            'Light meal preparation',
            'Emotional support'
          ],
          special_provisions: ['Flexible scheduling during first month'],
          cancellation_policy: '48-hour notice required for schedule changes',
          payment_terms: 'Weekly payments due on Fridays',
          created_date: '2025-08-10',
          last_updated: '2025-08-14',
          contract_url: '/contracts/SNK-2025-001.pdf'
        },
        {
          id: 'contract-2',
          contract_number: 'SNK-2025-002',
          client_id: user?.id || 'client-123',
          caregiver_id: 'caregiver-2',
          caregiver_name: 'John Davis',
          service_type: 'Lactation Support',
          contract_type: 'Consulting Agreement',
          status: 'Active',
          terms: {
            start_date: '2025-08-01',
            end_date: '2025-09-01',
            hours_per_week: 8,
            hourly_rate: 45,
            total_estimated_cost: 1440
          },
          services_included: [
            'Lactation consultation',
            'Breastfeeding education',
            'Pump fitting and training',
            'Follow-up support'
          ],
          cancellation_policy: 'No cancellation fee if 24-hour notice provided',
          payment_terms: 'Payment due upon service completion',
          created_date: '2025-07-25',
          last_updated: '2025-08-01',
          signed_date: '2025-07-30',
          contract_url: '/contracts/SNK-2025-002.pdf',
          signed_contract_url: '/contracts/SNK-2025-002-signed.pdf'
        },
        {
          id: 'contract-3',
          contract_number: 'SNK-2025-003',
          client_id: user?.id || 'client-123',
          service_type: 'Mental Health Support',
          contract_type: 'Care Plan',
          status: 'Draft',
          terms: {
            start_date: '2025-09-01',
            hours_per_week: 4,
            hourly_rate: 50,
            total_estimated_cost: 2400
          },
          services_included: [
            'Postpartum mental health counseling',
            'Coping strategies development',
            'Family support coordination'
          ],
          cancellation_policy: 'Standard cancellation policy applies',
          payment_terms: 'Monthly billing',
          created_date: '2025-08-12',
          last_updated: '2025-08-14'
        }
      ];

      setContracts(mockContracts);
      setError(null);
    } catch {
      setError('Failed to load contracts');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      case 'Awaiting Signature': return 'bg-orange-100 text-orange-800';
      case 'Signed': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSignContract = async () => {
    if (!selectedContract || !signatureText.trim()) {
      setError('Please provide your signature');
      return;
    }

    setIsSigningContract(true);
    setError(null);

    try {
      const result = await catalystClientFunctions.signContract(
        selectedContract.id,
        user?.id || '',
        signatureText
      );

      if (result.success) {
        // Update contract status
        setContracts(prev => prev.map(contract => 
          contract.id === selectedContract.id 
            ? { 
                ...contract, 
                status: 'Signed' as Contract['status'],
                signed_date: new Date().toISOString(),
                signed_contract_url: result.signed_contract_url
              }
            : contract
        ));
        setShowSigningModal(false);
        setSelectedContract(null);
        setSignatureText('');
      } else {
        setError('Failed to sign contract');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign contract');
    } finally {
      setIsSigningContract(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="healthcare-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-accent/20 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
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
          <AlertCircle className="h-5 w-5" />
          <span className="font-body">{error}</span>
        </div>
        <button
          onClick={loadContracts}
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
          Your Contracts
        </h3>
        {onNewContract && (
          <button
            onClick={onNewContract}
            className="healthcare-button-primary text-sm"
          >
            Request New Contract
          </button>
        )}
      </div>

      {/* Contracts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Contracts', value: contracts.filter(c => c.status === 'Active').length, color: 'text-green-600' },
          { label: 'Pending Signature', value: contracts.filter(c => c.status === 'Awaiting Signature').length, color: 'text-orange-600' },
          { label: 'Total Value', value: formatCurrency(contracts.reduce((sum, c) => sum + c.terms.total_estimated_cost, 0)), color: 'text-primary' },
          { label: 'This Month', value: formatCurrency(contracts.filter(c => c.status === 'Active').reduce((sum, c) => sum + (c.terms.hourly_rate * c.terms.hours_per_week * 4), 0)), color: 'text-blue-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-background p-4 rounded-lg">
            <div className="text-center">
              <div className={`font-heading text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="font-ui text-xs text-primary/60">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.length === 0 ? (
          <div className="healthcare-card p-8 text-center">
            <FileText className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <h4 className="font-heading text-primary mb-2">No contracts found</h4>
            <p className="font-body text-primary/60 mb-4">
              You haven't created any contracts yet.
            </p>
            {onNewContract && (
              <button
                onClick={onNewContract}
                className="healthcare-button-primary"
              >
                Request Your First Contract
              </button>
            )}
          </div>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className="healthcare-card p-6">
              {/* Contract Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-luxury/20 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-luxury" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-heading text-lg font-semibold text-primary">
                        {contract.contract_number}
                      </h4>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-primary">
                        {contract.service_type} - {contract.contract_type}
                      </p>
                      {contract.caregiver_name && (
                        <p className="font-body text-sm text-primary/70">
                          Caregiver: {contract.caregiver_name}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-primary/50">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {formatDate(contract.created_date)}
                        </span>
                        {contract.signed_date && (
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Signed: {formatDate(contract.signed_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-heading text-xl font-bold text-primary">
                    {formatCurrency(contract.terms.total_estimated_cost)}
                  </div>
                  <div className="font-body text-sm text-primary/60">
                    {formatCurrency(contract.terms.hourly_rate)}/hr × {contract.terms.hours_per_week} hrs/week
                  </div>
                </div>
              </div>

              {/* Contract Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-background p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary/60" />
                    <span className="font-ui text-sm text-primary/70">Duration</span>
                  </div>
                  <div className="font-body text-sm text-primary">
                    {formatDate(contract.terms.start_date)}
                    {contract.terms.end_date && ` - ${formatDate(contract.terms.end_date)}`}
                  </div>
                </div>

                <div className="bg-background p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <span className="font-ui text-sm text-primary/70">Schedule</span>
                  </div>
                  <div className="font-body text-sm text-primary">
                    {contract.terms.hours_per_week} hours/week
                  </div>
                </div>

                <div className="bg-background p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-primary/60" />
                    <span className="font-ui text-sm text-primary/70">Rate</span>
                  </div>
                  <div className="font-body text-sm text-primary">
                    {formatCurrency(contract.terms.hourly_rate)}/hour
                  </div>
                </div>
              </div>

              {/* Services Included */}
              <div className="mb-4">
                <h5 className="font-ui font-medium text-primary mb-2">Services Included:</h5>
                <div className="flex flex-wrap gap-2">
                  {contract.services_included.map((service, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 bg-luxury/10 text-luxury rounded-full text-xs font-ui"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setSelectedContract(contract);
                      setShowContractDetails(true);
                    }}
                    className="flex items-center space-x-1 text-primary/70 hover:text-primary transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="font-body text-sm">View Details</span>
                  </button>

                  {(contract.contract_url || contract.signed_contract_url) && (
                    <button className="flex items-center space-x-1 text-primary/70 hover:text-primary transition-colors">
                      <Download className="h-4 w-4" />
                      <span className="font-body text-sm">Download PDF</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {contract.status === 'Awaiting Signature' && (
                    <button
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowSigningModal(true);
                      }}
                      className="healthcare-button-primary text-sm flex items-center space-x-1"
                    >
                      <Pen className="h-4 w-4" />
                      <span>Sign Contract</span>
                    </button>
                  )}
                  
                  {contract.status === 'Draft' && (
                    <button className="healthcare-button-secondary text-sm flex items-center space-x-1">
                      <Edit className="h-4 w-4" />
                      <span>Request Changes</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contract Details Modal */}
      {showContractDetails && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <h2 className="font-heading text-xl font-semibold text-primary">
                Contract Details - {selectedContract.contract_number}
              </h2>
              <button
                onClick={() => {
                  setShowContractDetails(false);
                  setSelectedContract(null);
                }}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {/* Contract content would go here */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Contract Terms</h3>
                  <div className="bg-background p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-ui text-sm text-primary/70">Start Date:</span>
                        <p className="font-body text-primary">{formatDate(selectedContract.terms.start_date)}</p>
                      </div>
                      {selectedContract.terms.end_date && (
                        <div>
                          <span className="font-ui text-sm text-primary/70">End Date:</span>
                          <p className="font-body text-primary">{formatDate(selectedContract.terms.end_date)}</p>
                        </div>
                      )}
                      <div>
                        <span className="font-ui text-sm text-primary/70">Hours per Week:</span>
                        <p className="font-body text-primary">{selectedContract.terms.hours_per_week}</p>
                      </div>
                      <div>
                        <span className="font-ui text-sm text-primary/70">Hourly Rate:</span>
                        <p className="font-body text-primary">{formatCurrency(selectedContract.terms.hourly_rate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Payment Terms</h3>
                  <p className="font-body text-primary bg-background p-4 rounded-lg">
                    {selectedContract.payment_terms}
                  </p>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Cancellation Policy</h3>
                  <p className="font-body text-primary bg-background p-4 rounded-lg">
                    {selectedContract.cancellation_policy}
                  </p>
                </div>

                {selectedContract.special_provisions && selectedContract.special_provisions.length > 0 && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-3">Special Provisions</h3>
                    <ul className="font-body text-primary bg-background p-4 rounded-lg list-disc list-inside">
                      {selectedContract.special_provisions.map((provision, index) => (
                        <li key={index}>{provision}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signing Modal */}
      {showSigningModal && selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-luxury/20 p-3 rounded-lg">
                  <Pen className="h-6 w-6 text-luxury" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    Sign Contract
                  </h3>
                  <p className="font-body text-primary/60 text-sm">
                    {selectedContract.contract_number}
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="font-body text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block font-ui font-medium text-primary mb-2">
                    Digital Signature *
                  </label>
                  <input
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Type your full legal name"
                    className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                  />
                  <p className="font-body text-xs text-primary/60 mt-1">
                    By typing your name, you agree to the contract terms and provide your digital signature.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowSigningModal(false);
                    setSelectedContract(null);
                    setSignatureText('');
                    setError(null);
                  }}
                  className="px-4 py-2 font-body text-primary/70 hover:text-primary transition-colors"
                  disabled={isSigningContract}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignContract}
                  disabled={isSigningContract || !signatureText.trim()}
                  className="healthcare-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningContract ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>{isSigningContract ? 'Signing...' : 'Sign Contract'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};