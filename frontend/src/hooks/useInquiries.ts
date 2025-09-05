import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiriesApi } from '@/lib/api';
import type { Inquiry } from '@/types';

export function useInquiries() {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: inquiriesApi.getAll,
  });
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: ['inquiries', id],
    queryFn: () => inquiriesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => inquiriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useInquiryComparison(id: string) {
  return useQuery({
    queryKey: ['inquiries', id, 'comparison'],
    queryFn: () => inquiriesApi.getComparison(id),
    enabled: !!id,
  });
}

export function useAddInquiryResponse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ inquiryId, data }: { inquiryId: string; data: any }) => 
      inquiriesApi.addResponse(inquiryId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['inquiries', variables.inquiryId] });
      queryClient.invalidateQueries({ queryKey: ['inquiries', variables.inquiryId, 'comparison'] });
    },
  });
}

export function useUpdateInquiryResponseStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ responseId, status }: { responseId: string; status: string }) => 
      inquiriesApi.updateResponseStatus(responseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}