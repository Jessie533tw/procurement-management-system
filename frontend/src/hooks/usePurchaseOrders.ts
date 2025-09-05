import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseOrdersApi } from '@/lib/api';
import type { PurchaseOrder } from '@/types';

export function usePurchaseOrders() {
  return useQuery({
    queryKey: ['purchase-orders'],
    queryFn: purchaseOrdersApi.getAll,
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: () => purchaseOrdersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => purchaseOrdersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      purchaseOrdersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', variables.id] });
    },
  });
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: string; approvedBy: string }) => 
      purchaseOrdersApi.approve(id, approvedBy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', variables.id] });
    },
  });
}

export function useUpdatePurchaseOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      purchaseOrdersApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', variables.id] });
    },
  });
}

export function useDeliveryStatus() {
  return useQuery({
    queryKey: ['purchase-orders', 'delivery-status'],
    queryFn: purchaseOrdersApi.getDeliveryStatus,
  });
}

export function useCostAnalysis(projectId?: string) {
  return useQuery({
    queryKey: ['purchase-orders', 'cost-analysis', projectId],
    queryFn: () => purchaseOrdersApi.getCostAnalysis(projectId),
  });
}