// 專案相關類型
export interface Project {
  id: string;
  name: string;
  projectCode: string;
  description?: string;
  totalBudget: number;
  usedBudget: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  projectManager: string;
  createdAt: string;
  updatedAt: string;
}

// 供應商相關類型
export interface Vendor {
  id: string;
  name: string;
  vendorCode: string;
  taxId?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  paymentTerms?: string;
  specialties?: string[];
  status: 'active' | 'inactive' | 'blacklisted';
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// 材料相關類型
export interface Material {
  id: string;
  materialCode: string;
  name: string;
  description?: string;
  unit: string;
  category: string;
  subcategory?: string;
  specifications?: Record<string, any>;
  estimatedPrice?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 詢價相關類型
export interface Inquiry {
  id: string;
  inquiryNumber: string;
  projectId: string;
  title: string;
  description?: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'responded' | 'evaluated' | 'cancelled';
  requirements?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  items?: InquiryItem[];
  responses?: InquiryResponse[];
}

export interface InquiryItem {
  id: string;
  inquiryId: string;
  materialId: string;
  quantity: number;
  unit: string;
  specifications?: string;
  notes?: string;
  requiredDate?: string;
  material?: Material;
}

export interface InquiryResponse {
  id: string;
  inquiryId: string;
  vendorId: string;
  responseDate: string;
  totalAmount: number;
  paymentTerms?: string;
  deliveryDays?: number;
  notes?: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
  evaluationScore?: number;
  evaluationNotes?: string;
  vendor?: Vendor;
  items?: InquiryResponseItem[];
}

export interface InquiryResponseItem {
  id: string;
  responseId: string;
  inquiryItemId: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDays?: number;
  notes?: string;
  isAvailable: boolean;
}

// 採購相關類型
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  projectId: string;
  vendorId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  totalAmount: number;
  paymentTerms?: string;
  status: 'draft' | 'approved' | 'sent' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  vendor?: Vendor;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  materialId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  receivingStatus: 'pending' | 'partial' | 'completed';
  specifications?: string;
  notes?: string;
  material?: Material;
}

// 專案預算類型
export interface ProjectBudget {
  id: string;
  projectId: string;
  category: string;
  itemName: string;
  description?: string;
  budgetAmount: number;
  committedAmount: number;
  actualAmount: number;
  isLocked: boolean;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

// 專案進度類型
export interface ProjectProgress {
  id: string;
  projectId: string;
  purchaseOrderId?: string;
  taskName: string;
  description?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  completionPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  responsiblePerson: string;
  notes?: string;
  milestones?: Record<string, any>;
}

// 財務記錄類型
export interface FinancialRecord {
  id: string;
  voucherNumber: string;
  projectId: string;
  purchaseOrderId?: string;
  recordType: 'expense' | 'payment' | 'accrual' | 'adjustment';
  recordDate: string;
  amount: number;
  accountCode: string;
  accountName: string;
  description: string;
  vendorName?: string;
  invoiceNumber?: string;
  status: 'draft' | 'approved' | 'posted';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

// API 回應類型
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 表單類型
export interface CreateProjectForm {
  name: string;
  projectCode: string;
  description?: string;
  totalBudget: number;
  status?: Project['status'];
  startDate: string;
  endDate?: string;
  projectManager: string;
}

export interface CreateVendorForm {
  name: string;
  taxId?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  paymentTerms?: string;
  specialties?: string[];
  status?: Vendor['status'];
  rating?: number;
}

export interface CreateMaterialForm {
  name: string;
  description?: string;
  unit: string;
  category: string;
  subcategory?: string;
  specifications?: Record<string, any>;
  estimatedPrice?: number;
  isActive?: boolean;
}