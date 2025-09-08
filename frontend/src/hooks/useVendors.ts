import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsApi } from '@/lib/api';
import type { Vendor, CreateVendorForm } from '@/types';

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: vendorsApi.getAll,
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ['vendors', id],
    queryFn: () => vendorsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVendorForm) => vendorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVendorForm> }) => 
      vendorsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors', variables.id] });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => vendorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useUpdateVendorRating() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) => 
      vendorsApi.updateRating(id, rating),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors', variables.id] });
    },
  });
}

export function useVendorPerformanceAnalysis(vendorId?: string) {
  return useQuery({
    queryKey: ['vendors', 'performance-analysis', vendorId],
    queryFn: () => vendorsApi.getPerformanceAnalysis(vendorId),
  });
}

export function useVendorsBySpecialty(specialty: string) {
  return useQuery({
    queryKey: ['vendors', 'specialty', specialty],
    queryFn: () => vendorsApi.getBySpecialty(specialty),
    enabled: !!specialty,
  });
}

export function useTopVendors(limit?: number) {
  return useQuery({
    queryKey: ['vendors', 'top', limit],
    queryFn: () => vendorsApi.getTopVendors(limit),
  });
}