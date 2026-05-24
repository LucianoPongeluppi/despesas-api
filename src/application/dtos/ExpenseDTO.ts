export type CreateExpenseDTO = {
  value: number;
  purchaseDate: string;
  description: string;
  paymentTypeId: string;
  categoryId: string;
  zipCode: string;
  addressNumber: string;
};

export type UpdateExpenseDTO = {
  value?: number;
  purchaseDate?: string;
  description?: string;
  paymentTypeId?: string;
  categoryId?: string;
  zipCode?: string;
  addressNumber?: string;
};

export type PatchExpenseValueDTO = {
  value: number;
};
