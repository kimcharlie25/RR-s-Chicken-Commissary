import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface CustomerAccount {
    id: string;
    username: string;
    password?: string;
    branch_name: string;
    created_at?: string;
}

export const useCustomerAccounts = () => {
    const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('customer_accounts')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setAccounts(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setError('Failed to fetch customer accounts');
        } finally {
            setLoading(false);
        }
    }, []);

    const addAccount = async (account: Omit<CustomerAccount, 'id' | 'created_at'>) => {
        try {
            const { data, error: insertError } = await supabase
                .from('customer_accounts')
                .insert(account)
                .select()
                .single();

            if (insertError) throw insertError;
            await fetchAccounts();
            return data;
        } catch (err) {
            console.error('Error adding account:', err);
            throw err;
        }
    };

    const updateAccount = async (id: string, updates: Partial<CustomerAccount>) => {
        try {
            const { error: updateError } = await supabase
                .from('customer_accounts')
                .update(updates)
                .eq('id', id);

            if (updateError) throw updateError;
            await fetchAccounts();
        } catch (err) {
            console.error('Error updating account:', err);
            throw err;
        }
    };

    const deleteAccount = async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('customer_accounts')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            await fetchAccounts();
        } catch (err) {
            console.error('Error deleting account:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        accounts,
        loading,
        error,
        addAccount,
        updateAccount,
        deleteAccount,
        refetch: fetchAccounts
    };
};
