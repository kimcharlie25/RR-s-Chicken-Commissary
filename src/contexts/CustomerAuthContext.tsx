import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface CustomerAccount {
    id: string;
    username: string;
    branch_name: string;
}

interface CustomerAuthContextType {
    customer: CustomerAccount | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<{ data: CustomerAccount | null; error: string | null }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuthContext = () => {
    const context = useContext(CustomerAuthContext);
    if (context === undefined) {
        throw new Error('useCustomerAuthContext must be used within a CustomerAuthProvider');
    }
    return context;
};

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customer, setCustomer] = useState<CustomerAccount | null>(() => {
        const saved = localStorage.getItem('rr_customer_session');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('customer_accounts')
                .select('id, username, branch_name')
                .eq('username', username)
                .eq('password', password)
                .single();

            if (fetchError || !data) {
                throw new Error('Invalid username or password');
            }

            setCustomer(data);
            localStorage.setItem('rr_customer_session', JSON.stringify(data));
            return { data, error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            return { data: null, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setCustomer(null);
        localStorage.removeItem('rr_customer_session');
    };

    const value = {
        customer,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!customer
    };

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    );
};
