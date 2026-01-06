import { useCustomerAuthContext } from '../contexts/CustomerAuthContext';

export const useCustomerAuth = () => {
    return useCustomerAuthContext();
};
