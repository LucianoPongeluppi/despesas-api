export type AddressData = {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export interface IAddressService {
  getAddressByZipCode(zipCode: string): Promise<AddressData>;
}
