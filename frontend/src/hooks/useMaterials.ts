import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi } from '@/lib/api';
import type { Material, CreateMaterialForm } from '@/types';

export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: materialsApi.getAll,
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: () => materialsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMaterialForm) => materialsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials', 'categories'] });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMaterialForm> }) => 
      materialsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials', variables.id] });
    },
  });
}

export function useDeactivateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => materialsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

export function useMaterialCategories() {
  return useQuery({
    queryKey: ['materials', 'categories'],
    queryFn: materialsApi.getCategories,
  });
}

export function useSearchMaterials(query: string) {
  return useQuery({
    queryKey: ['materials', 'search', query],
    queryFn: () => materialsApi.search(query),
    enabled: !!query && query.length >= 2,
  });
}

export function useTopMaterials(limit?: number) {
  return useQuery({
    queryKey: ['materials', 'top', limit],
    queryFn: () => materialsApi.getTopMaterials(limit),
  });
}

export function useMaterialUsageAnalysis(materialId?: string) {
  return useQuery({
    queryKey: ['materials', 'usage-analysis', materialId],
    queryFn: () => materialsApi.getUsageAnalysis(materialId),
  });
}

export function useMaterialsByCategory(category: string) {
  return useQuery({
    queryKey: ['materials', 'category', category],
    queryFn: () => materialsApi.getByCategory(category),
    enabled: !!category,
  });
}

export function useMaterialPriceHistory(id: string) {
  return useQuery({
    queryKey: ['materials', id, 'price-history'],
    queryFn: () => materialsApi.getPriceHistory(id),
    enabled: !!id,
  });
}