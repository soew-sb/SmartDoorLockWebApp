import { useState, useEffect } from 'react';
import { Table, Badge, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { OtpRecord } from '../types/database';

export default function OtpRecordsView() {
  const [records, setRecords] = useState<OtpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOtpRecords();
  }, []);

  async function fetchOtpRecords() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('otp_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'warning',
      verified: 'success',
      failed: 'danger',
    };
    return <Badge bg={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">OTP Records</h2>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Created At</th>
            <th>Device ID</th>
            <th>OTP</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{format(new Date(record.created_at), 'PPpp')}</td>
              <td>{record.device_id || 'N/A'}</td>
              <td>
                <code className="bg-light p-1 rounded">{record.otp}</code>
              </td>
              <td>{getStatusBadge(record.status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
